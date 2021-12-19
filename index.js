let express = require('express');
let app = express();
let reportRoute = require(`./routes/report`);

app.use(reportRoute);

const PORT = process.env.PORT || 3434;
app.listen(PORT, () => console.info(`Server started on port ${PORT}`));