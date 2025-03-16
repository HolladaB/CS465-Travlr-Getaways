/* GET travel view */
const travel = (req, res) => {
    res.render('travel', { title: 'Travl Getaways'});
};

module.exports = {
    travel
};