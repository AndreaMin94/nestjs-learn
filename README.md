curl -X POST http://localhost:3000/authors -H "Content-Type: application/json" -d '{"name": "Andrea Mininni"}'

curl -X POST http://localhost:3000/books -H "Content-Type: application/json" -d '{"title": "Sherlock Holmes", "authorId": 1, "publicationDate": "2002-01-01", "numberOfPages": 200, "language": "en"}'

curl -X GET http://localhost:3000/books

curl -X PATCH http://localhost:3000/books/1 -H "Content-Type: application/json" -d '{"title": "Le avventure di Sherlock Holmes"}'