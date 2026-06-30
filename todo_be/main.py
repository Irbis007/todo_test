from fastapi import FastAPI, Depends
from sqlalchemy.orm import Session
from sqlalchemy import case
from fastapi.middleware.cors import CORSMiddleware
from database import SessionLocal, engine, Base
from models import Task, TaskStatus, TaskPriority, TaskUpdate, TaskResponse, TaskCreate, SortBy, SortOrder, TaskListResponse
from fastapi import HTTPException

app = FastAPI()


app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

Base.metadata.create_all(bind=engine)

priority_order = case(
    (Task.priority == TaskPriority.HIGH, 3),
    (Task.priority == TaskPriority.NORMAL, 2),
    (Task.priority == TaskPriority.LOW, 1),
)


def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()



@app.post("/tasks", response_model=TaskResponse)
def create_task(task: TaskCreate, db: Session = Depends(get_db)):
    new_task = Task(
        title=task.title,
        description=task.description,
        status=task.status,
        priority=task.priority,
    )

    db.add(new_task)
    db.commit()
    db.refresh(new_task)

    return new_task


@app.get("/tasks", response_model=TaskListResponse)
def get_tasks(
    status: TaskStatus | None = None,
    priority: TaskPriority | None = None,
    search: str | None = None,
    page: int = 1,
    limit: int = 10,
    sort_by: SortBy = SortBy.CREATED_AT,
    order: SortOrder = SortOrder.DESC,
    db: Session = Depends(get_db)
):
    query = db.query(Task)

    if status:
        query = query.filter(Task.status == status)
    if priority:
        query = query.filter(Task.priority == priority)
    if search:
        query = query.filter(
            Task.title.like(f"%{search}%")
        )

    
    if sort_by == SortBy.CREATED_AT:
        query = query.order_by(
            Task.created_at.asc()
            if order == SortOrder.ASC
            else Task.created_at.desc()
        )
    elif sort_by == SortBy.PRIORITY:
        query = query.order_by(
            Task.priority.asc()
            if order == SortOrder.ASC
            else Task.priority.desc()
        )

    
    total = query.count()

    items = (
        query
        .offset((page - 1) * limit)
        .limit(limit)
        .all()
    )

    return {
        "items": items,
        "total": total,
        "page": page,
        "limit": limit
    }


@app.patch("/tasks/{task_id}", response_model=TaskResponse)
def update_task(
    task_id: int,
    task_data: TaskUpdate,
    db: Session = Depends(get_db)
):
    task = db.query(Task).filter(Task.id == task_id).first()

    if not task:
        raise HTTPException(status_code=404, detail="Task not found")

    if task.status == TaskStatus.DONE:
        raise HTTPException(
            status_code=400,
            detail="Completed tasks cannot be modified"
        )

    for key, value in task_data.model_dump(exclude_unset=True).items():
        setattr(task, key, value)

    db.commit()
    db.refresh(task)

    return task

@app.delete("/tasks/{task_id}")
def delete_task(
    task_id: int,
    is_admin: bool = False,
    db: Session = Depends(get_db)
):
    task = db.query(Task).filter(Task.id == task_id).first()

    if not is_admin:
        raise HTTPException(
            status_code=403,
            detail="Only admin can delete tasks"
        )

    if not task:
        raise HTTPException(
            status_code=404,
            detail="Task not found"
        )

    if task.status == TaskStatus.DONE:
        raise HTTPException(
            status_code=400,
            detail="Completed tasks cannot be deleted"
        )

    db.delete(task)
    db.commit()

    return {
        "message": "Task deleted"
    }