##  Usage

1. Navigate to repo folder in the terminal
2. Start node/express server with `npm run serve`
3. Make calls via curl or Postman to `http://localhost:3434/reports/{id}/checkout?userId={userId}` endpoint, where `id` and `userId` are any numbers.

Note 1: URI naming changed to plural `reports` as per REST API general convention.
Note 2: .env file is checked out to speedup communication, sure it's should not.

## Task

At Ezra, we are designing a web app for our medical team to compose MRI reports for our
members. One of the requirements of this app is that only one user can work on a particular
report at a time.

### Section 1

For your assignment you will implement three endpoints that mimic this subset functionality.

● /report/<id>/checkout :
Allows the user to checkout a report document after which no other user can checkout
that report. If a report id does not exist, create it in your data structure.
If the release endpoint (see below) is not called, the checked out report is released after
a certain number of minutes. The time is configurable as an environment variable.

● /report/<id>/release :
Allows the user who checked out the report with id <id> to release the report, another
user should now be able to checkout this report.

● /report/<id>/renew:
Allows the user who checked out the report to renew the lock.

Notes:

● Feel free to use some sort of in memory data structure and not worry about connecting to a database
● For the purpose of this exercise the returned json can contain any information you think is useful
● You should document how to run your server
● Our backend is in Python but feel free to write your answers in any programming
language

### Section 2

Please provide a high level description of how you would productionize your code from section
1. What things would you change or add to make it production ready?