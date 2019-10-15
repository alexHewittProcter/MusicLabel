const express = require('express');
const bodyParser = require('body-parser');
const fs = require('fs');
const asyncFs = fs.promises;
const app = express();
const port = 5000;

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));

// When run check if user_files exist
(() => {
    fs.exists("./user_files",(result) => {
        if(!result) {
            fs.mkdir("./user_files",(err) => {
                console.log(err);
            });
        }
    });
})();

const getUserInfo = async () => {
    return await asyncFs.readFile('user_files/settings.json')
        .catch(err => console.log(err))
        .then(data => data === undefined ? {} : data);
}

// Endpoints
app.get('/api/userinfo', async (req,res) => {
    const userInfo = await getUserInfo();
    res.setHeader("content-type",'application/json');
    res.statusCode = 200;
    res.send(userInfo);
});
app.post('/api/userinfo',async (req,res) => {
    //Save settings then send back
    await asyncFs.writeFile('user_files/settings.json',JSON.stringify(req.body))
        .catch(err => console.log(err));
    res.send(req.body);
    res.statusCode = 200;
    res.end();
})

app.listen(port,() => {
    console.log(`Listening on port ${port}`);
});