/* GET Homepage */
const index = (req, res) => {
    res.render('index', { title: " Travl Getaways"});
};

module.exports = {
    index
}