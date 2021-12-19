let express = require(`express`);
let router = express.Router();

router.get(`/reports/:id/checkout`, (req, res) => {
    /* 
    Get report record like 
    {
        id: 213141
        data: {
            checkedOut: true,
            ownershipStarted: 163234489897,
            ownerId: 298237,
        }

    }
    */
    res.send(`you requested a id ${req.params.id} for user ${req.query.name}`);
})

router.put(`/reports/:id/checkout`, (req, res) => {
    /* 
    Create/update report record with 
    {
        id: 213141
        data: {
            ownershipClaimed: true,
            ownershipStarted: 163234489897,
            ownerId: 298237,
        }

    }
    */
    // 0. Check if report is claimed
    // 1. Create or update report with new ownership
    // 2. Start timer on release endpoint, check env file for value
    // 3. If other user is checking out this report, show error message
    res.send(`you requested a id ${req.params.id} for user ${req.query.name}`);
})

router.put(`/reports/:id/release`, (req, res) => {
    // 0. Check if report is claimed, error if it is.
    // 1. Check if user is a current owner of the report, error if not.
    // 2. Release ownership
    res.send(`you requested a id ${req.params.id} for user ${req.query.name}`);
})

router.put(`/reports/:id/renew`, (req, res) => {
    // 0. Check if report is claimed, error if it is.
    // 1. Check if user is a current owner of the report, error if not.
    // 2. Update report with new ownershipStarted
    // 3. Start timer on release endpoint, check env file for value
    // 4. If other user is checking out this report, show error message
    res.send(`you requested a id ${req.params.id} for user ${req.query.name}`);
})

/*

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

*/

module.exports = router;