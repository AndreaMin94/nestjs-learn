curl -X POST http://localhost:3000/authors -H "Content-Type: application/json" -d '{"name": "Andrea Mininni"}'

curl -v -X POST http://localhost:3000/books -H "Content-Type: application/json" -H "Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6MiwiZW1haWwiOiJhZG1pbkBnbWFpbC5jb20iLCJyb2xlIjoiYWRtaW4iLCJpYXQiOjE3NzAzOTM5NzcsImV4cCI6MTc3MDM5NzU3N30.ghjznP3_V04PgF-Kodp5sRjezo4yWwWi2yQGp0HdZRk" -d '{"title": "Sherlock Holmes", "authorId": 1, "publicationDate": "2002-01-01", "numberOfPages": 200, "language": "en"}'

curl -X GET http://localhost:3000/books -H "Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6MSwiZW1haWwiOiJtaW5pbm5pYW5kcmVhQGdtYWlsLmNvbSIsInJvbGUiOiJ2aWV3ZXIiLCJpYXQiOjE3NzAzOTI1NTIsImV4cCI6MTc3MDM5NjE1Mn0.6jQdUcWmpkPA6dbSCLr2ggZH8PKzFQr78idfe4pZ5Pc"

curl -X PATCH http://localhost:3000/books/1 -H "Content-Type: application/json" -d '{"title": "Le avventure di Sherlock Holmes"}'

curl -X POST http://localhost:3000/auth/signup -H "Content-Type: application/json" -d '{"email": "mininniandrea@gmail.com", "password": "12345678"}'
curl -X POST http://localhost:3000/auth/signin -H "Content-Type: application/json" -d '{"email": "mininniandrea@gmail.com", "password": "12345678"}'
