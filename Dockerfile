# Backend
FROM python:3.8 AS backend
WORKDIR /app/todo-backend
COPY todo-backend/requirements.txt requirements.txt
RUN pip install --no-cache-dir -r requirements.txt
COPY todo-backend/ .
EXPOSE 5000
CMD ["python", "app.py"]

# Frontend
FROM node:16.3.0 AS frontend
WORKDIR /app/todo-frontend
COPY todo-frontend/ .
RUN npm install && npm run build

# Final image
FROM nginx:latest
COPY --from=frontend /app/todo-frontend/dist /usr/share/nginx/html
COPY --from=backend /app/todo-backend /app/todo-backend
COPY infrastructure/nginx.conf /etc/nginx/conf.d/default.conf
EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]
