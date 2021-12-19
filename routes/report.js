let express = require(`express`);
let router = express.Router();
if (typeof localStorage === "undefined" || localStorage === null) {
    var LocalStorage = require('node-localstorage').LocalStorage;
    localStorage = new LocalStorage('./storage');
}

router.get(`/reports/:id/`, (req, res) => {
    res.json(JSON.parse(localStorage.getItem(req.params.id)));
})


router.put(`/reports/:id/checkout/`, (req, res) => {
    let status
    let response = {}

    if (!req.query.userId) {
        response.success = false
        response.data = { error: `Missing user id`, errorMessage: `Please put name into the request query` };
        res.status(400).json(response)
    }

    // Create or update report with new ownership
    let recordRaw = localStorage.getItem(req.params.id);
    if (recordRaw) {
        let record = JSON.parse(recordRaw);
        if (record.data.ownershipClaimed) {
            response.success = false
            response.data = { error: `Checked out`, errorMessage: `Report already checked out` };
            status = 400
        } else {
            // Check out existing report record
            response.success = true
            let record = {
                id: req.params.id,
                data: {
                    ownershipClaimed: true,
                    ownershipStarted: Date.now(),
                    ownerId: req.query.userId,
                }

            }
            localStorage.setItem(record.id, JSON.stringify(record))
            setReleaseTimer(record.id)
            status = 201
        }
    } else {
        // Create new report record in the db and check it out
        let record = {
            id: req.params.id,
            data: {
                ownershipClaimed: true,
                ownershipStarted: Date.now(),
                ownerId: req.query.userId,
            }

        }
        response.success = true
        response.data = { message: `Record was created!`, record: record };
        localStorage.setItem(record.id, JSON.stringify(record));
        setReleaseTimer(record.id)
        status = 201
    }
    res.status(status).json(response)
})

router.put(`/reports/:id/release`, (req, res) => {
    let status
    let response = {}

    if (!req.query.userId) {
        response.success = false
        response.data = { error: `Missing user id`, errorMessage: `Please put name into the request query` };
        res.status(400).json(response)
    }

    let recordRaw = localStorage.getItem(req.params.id);

    if (!recordRaw) {
        response.success = false
        response.data = { error: `Missing report record`, errorMessage: `Please check report id the request query` };
        res.status(400).json(response)
    }

    let record = JSON.parse(recordRaw);

    if (record.data.ownerId != req.query.userId) {
        response.success = false
        response.data = {
            error: `Ownership error`,
            errorMessage: `You are not the current owner of this report record.
            \nWait for up to 60 minutes for ownership release.`
        };
        res.status(400).json(response)
    }

    if (record.data.ownershipClaimed) {
        let record = JSON.parse(recordRaw);
        record.data.ownershipClaimed = false
        localStorage.setItem(record.id, JSON.stringify(record));
        response.success = true
        response.data = {};
        status = 201
    } else {
        response.success = false
        response.data = {
            error: `Ownership already released`,
            errorMessage: `You have previously release the ownership for this report record or timer is expired`
        };
        status = 400
    }

    res.status(status).json(response)
})

router.put(`/reports/:id/renew`, (req, res) => {
    let status
    let response = {}

    if (!req.query.userId) {
        response.success = false
        response.data = { error: `Missing user id`, errorMessage: `Please put name into the request query` };
        res.status(400).json(response)
    }

    let recordRaw = localStorage.getItem(req.params.id);

    if (!recordRaw) {
        response.success = false
        response.data = { error: `Missing report record`, errorMessage: `Please check report id the request query` };
        res.status(400).json(response)
    }

    let record = JSON.parse(recordRaw);

    if (record.data.ownerId != req.query.userId) {
        response.success = false
        response.data = {
            error: `Ownership error`,
            errorMessage: `You are not the current owner of this report record.
            \nWait for up to 60 minutes for ownership release.`
        };
        res.status(400).json(response)
    }

    if (record.data.ownershipClaimed) {
        let record = JSON.parse(recordRaw);
        setReleaseTimer(record.id)
        response.success = true
        response.data = {};
        status = 201
    } else {
        response.success = false
        response.data = {
            error: `Ownership already released`,
            errorMessage: `You have previously release the ownership for this report record or timer is expired`
        };
        status = 400
    }

    res.status(status).json(response)
})

function setReleaseTimer(id) {
    setTimeout(() => {
        let record = JSON.parse(localStorage.getItem(id));
        record.data.ownershipClaimed = false
        localStorage.setItem(id, JSON.stringify(record));
    }, 3600 * 1000);
}

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