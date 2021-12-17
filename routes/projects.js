const express = require('express');
const { check } = require('express-validator');
const router = express.Router();
const projectsController = require('../controllers/projectsController');
const auth = require('../middleware/auth');

// Manage Projets
// api/projects

// Create a project
router.post('/',
    auth,
    [
        check('projname', 'El nombre del proyecto es obligatorio').trim().isLength({ min: 1 })
    ],
    projectsController.createProject);

//Get the user's projects
router.get('/',
    auth,
    projectsController.getProjects);

//Update a project
router.put('/:id',
    auth,
    [
        check('projname', 'El nombre del proyecto es obligatorio').trim().isLength({ min: 1 })
    ],
    projectsController.updateProject);
    
//Delete a project
router.delete('/:id',
    auth,
    projectsController.deleteProject);

module.exports = router;
