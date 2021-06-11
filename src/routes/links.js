const { Router } = require('express');
const express = require('express');
const router = express.Router();

const pool = require('../database');
const {isLoggedIn} =  require('../lib/auth');

router.get('/add', isLoggedIn, (req, res) => {
    res.render('links/add');
})

// Add LinK
router.post('/add', isLoggedIn, async (req, res) => {
    const { title, url, description } = req.body;
    const newLink = {
        title,
        url,
        description,
        user_id : req.user.id
    };
    await pool.query('INSERT INTO links set ?', [newLink]);
    req.flash('success', 'Link saved successfully');
    res.redirect('/links');
});

// Get All Links
router.get('/', isLoggedIn, async (req, res) => {
    const links = await pool.query('SELECT * FROM links WHERE user_id = ?', [req.user.id]);
    console.log(links);
    res.render('links/list', {links});
});


// Delete Link
router.get('/delete/:id', isLoggedIn, async (req, res) => {
    const {id} = req.params;
    await pool.query('DELETE FROM links WHERE id = ?', [id]);
    req.flash('success', 'Link Removed Successfully');
    res.redirect('/links')
});

// Update Link
router.get('/edit/:id', isLoggedIn, async (req, res) => {
    const {id} = req.params;
    const links = await pool.query('SELECT * FROM links WHERE id = ?', [id]);
    res.render('links/edit', {link: links[0]});
});

router.post('/edit/:id', isLoggedIn, async (req, res) => {
    const {id} = req.params;
    const {title, description, url} = req.body;
    const newLink = {
        title, description, url
    }
    await pool.query('UPDATE links SET ? WHERE id = ?', [newLink, id]);
    req.flash('success', 'Link Updated successfully');
    res.redirect('/links');
});

module.exports = router;