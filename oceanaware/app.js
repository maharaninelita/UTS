const express = require('express');
const session = require('express-session');
const bodyParser = require('body-parser');
const db = require('./database');

const app = express();
app.set('view engine', 'ejs');
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static('public'));
app.use(session({ secret: 'secret', resave: false, saveUninitialized: true }));


app.get('/', (req, res) => {
    res.render('index', { title: 'OceanAware' });
});


app.get('/login', (req, res) => {
    res.render('login', { title: 'Login' });
});


app.post('/login', (req, res) => {
    const { username, password } = req.body;
    db.query('SELECT * FROM users WHERE username = ? AND password = ?', [username, password], (err, results) => {
        if (results.length > 0) {
            req.session.user = results[0];
            res.redirect('/users');
        } else {
            res.send('Username atau password salah!');
        }
    });
});


app.get('/users', (req, res) => {
    if (!req.session.user) {
        return res.redirect('/login');
    }

    db.query('SELECT * FROM users', (err, users) => {
        if (err) throw err;
        res.render('users', { title: 'Manage Users', users });
    });
});


app.post('/addUser', (req, res) => {
    const { username, password } = req.body;
    db.query('INSERT INTO users (username, password) VALUES (?, ?)', [username, password], (err) => {
        if (err) throw err;
        res.redirect('/users');
    });
});


app.get('/editUser/:id', (req, res) => {
    const userId = req.params.id;
    db.query('SELECT * FROM users WHERE id = ?', [userId], (err, results) => {
        if (err) throw err;
        res.render('editUser', { title: 'Edit User', user: results[0] });
    });
});


app.post('/editUser/:id', (req, res) => {
    const userId = req.params.id;
    const { username, password } = req.body;
    db.query('UPDATE users SET username = ?, password = ? WHERE id = ?', [username, password, userId], (err) => {
        if (err) throw err;
        res.redirect('/users');
    });
});


app.post('/deleteUser/:id', (req, res) => {
    const userId = req.params.id;
    db.query('DELETE FROM users WHERE id = ?', [userId], (err) => {
        if (err) throw err;
        res.redirect('/users');
    });
});


app.get('/volunteers', (req, res) => {
    db.query('SELECT * FROM volunteers', (err, volunteers) => {
        if (err) throw err;
        res.render('volunteers', { title: 'Manage Volunteers', volunteers });
    });
});


app.post('/addVolunteer', (req, res) => {
    const { name, contact } = req.body;
    db.query('INSERT INTO volunteers (name, contact) VALUES (?, ?)', [name, contact], (err) => {
        if (err) throw err;
        res.redirect('/volunteers');
    });
});


app.get('/editVolunteer/:id', (req, res) => {
    const volunteerId = req.params.id;
    db.query('SELECT * FROM volunteers WHERE id = ?', [volunteerId], (err, results) => {
        if (err) throw err;
        res.render('editVolunteer', { title: 'Edit Volunteer', volunteer: results[0] });
    });
});


app.post('/editVolunteer/:id', (req, res) => {
    const volunteerId = req.params.id;
    const { name, contact } = req.body;
    db.query('UPDATE volunteers SET name = ?, contact = ? WHERE id = ?', [name, contact, volunteerId], (err) => {
        if (err) throw err;
        res.redirect('/volunteers');
    });
});


app.post('/deleteVolunteer/:id', (req, res) => {
    const volunteerId = req.params.id;
    db.query('DELETE FROM volunteers WHERE id = ?', [volunteerId], (err) => {
        if (err) throw err;
        res.redirect('/volunteers');
    });
});


app.get('/eventDates', (req, res) => {
    db.query('SELECT * FROM event_dates', (err, eventDates) => {
        if (err) throw err;
        res.render('eventDates', { title: 'Manage Event Dates', eventDates });
    });
});


app.post('/addEventDate', (req, res) => {
    const { date } = req.body;
    db.query('INSERT INTO event_dates (date) VALUES (?)', [date], (err) => {
        if (err) throw err;
        res.redirect('/eventDates');
    });
});


app.get('/editEventDate/:id', (req, res) => {
    const eventDateId = req.params.id;
    db.query('SELECT * FROM event_dates WHERE id = ?', [eventDateId], (err, results) => {
        if (err) throw err;
        res.render('editEventDate', { title: 'Edit Event Date', eventDate: results[0] });
    });
});


app.post('/editEventDate/:id', (req, res) => {
    const eventDateId = req.params.id;
    const { date } = req.body;
    db.query('UPDATE event_dates SET date = ? WHERE id = ?', [date, eventDateId], (err) => {
        if (err) throw err;
        res.redirect('/eventDates');
    });
});


app.post('/deleteEventDate/:id', (req, res) => {
    const eventDateId = req.params.id;
    db.query('DELETE FROM event_dates WHERE id = ?', [eventDateId], (err) => {
        if (err) throw err;
        res.redirect('/eventDates');
    });
});


app.get('/locations', (req, res) => {
    db.query('SELECT * FROM locations', (err, locations) => {
        if (err) throw err;
        res.render('locations', { title: 'Manage Locations', locations });
    });
});


app.post('/addLocation', (req, res) => {
    const { address } = req.body;
    db.query('INSERT INTO locations (address) VALUES (?)', [address], (err) => {
        if (err) throw err;
        res.redirect('/locations');
    });
});


app.get('/editLocation/:id', (req, res) => {
    const locationId = req.params.id;
    db.query('SELECT * FROM locations WHERE id = ?', [locationId], (err, results) => {
        if (err) throw err;
        res.render('editLocation', { title: 'Edit Location', location: results[0] });
    });
});


app.post('/editLocation/:id', (req, res) => {
    const locationId = req.params.id;
    const { address } = req.body;
    db.query('UPDATE locations SET address = ? WHERE id = ?', [address, locationId], (err) => {
        if (err) throw err;
        res.redirect('/locations');
    });
});


app.post('/deleteLocation/:id', (req, res) => {
    const locationId = req.params.id;
    db.query('DELETE FROM locations WHERE id = ?', [locationId], (err) => {
        if (err) throw err;
        res.redirect('/locations');
    });
});


const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
});
