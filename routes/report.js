let express = require(`express`);
let router = express.Router();
if (typeof localStorage === "undefined" || localStorage === null) {
    var LocalStorage = require('node-localstorage').LocalStorage;
    localStorage = new LocalStorage('./storage');
}

router.get(`/reports/:id/`, (req, res) => {
    let response = {}
    let recordRaw = localStorage.getItem(req.params.id);
    if (!recordRaw) {
        response.success = false
        response.data = { error: `Missing report record`, errorMessage: `Please check report id the request query` };
        res.status(400).json(response)
    } else {
        let record = JSON.parse(recordRaw);
        response.success = true
        response.data = { message: `Record is retrieved`, record: record };
        res.status(200).json(response)
    }
})

router.put(`/reports/:id/checkout/`, (req, res) => {
    let response = {}

    if (!req.query.userId) {
        response.success = false
        response.data = { error: `Missing user id`, errorMessage: `Please put name into the request query` };
        res.status(400).json(response)
    }

    let recordRaw = localStorage.getItem(req.params.id);

    if (!recordRaw) {
        let record = {
            id: req.params.id,
            data: {
                ownershipClaimed: true,
                ownerId: req.query.userId,
            }

        }
        response.success = true
        response.data = { message: `Record was created!`, record: record };
        localStorage.setItem(record.id, JSON.stringify(record));
        setReleaseTimer(record.id)
        res.status(201).json(response)
    }

    let record = JSON.parse(recordRaw);

    if (!record.data.ownershipClaimed) {
        record.data.ownershipClaimed = true
        response.success = true
        response.data = { message: `Record was updated!`, record: record };
        localStorage.setItem(record.id, JSON.stringify(record));
        setReleaseTimer(record.id)
        res.status(201).json(response)
    } else {
        response.success = false
        response.data = {
            error: `Ownership already claimed`,
            errorMessage: `Ownership have been previously claimed for this report record.`
        };
        res.status(401).json(response)
    }
})

router.put(`/reports/:id/release`, (req, res) => {
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
        response.data = { message: `Record was updated!`, record: record };
        res.status(201).json(response)
    } else {
        response.success = false
        response.data = {
            error: `Ownership already released`,
            errorMessage: `You have previously release the ownership for this report record or timer is expired`
        };
        res.status(400).json(response)
    }
})

router.put(`/reports/:id/renew`, (req, res) => {
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
        response.data = { message: `Timer was updated!`, record: record };
        res.status(201).json(response)
    } else {
        response.success = false
        response.data = {
            error: `Ownership already released`,
            errorMessage: `You have previously release the ownership for this report record or timer is expired`
        };
        res.status(400).json(response)
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