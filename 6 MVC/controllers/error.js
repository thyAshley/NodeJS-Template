exports.get404 = (req, res) => {
    res.render('404', {pageTitle: 'Page not Found', path: '/404'});
}