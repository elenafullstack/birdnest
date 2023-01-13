const pilotsRouter = require('express').Router()
const fetch=require("node-fetch");

pilotsRouter.get('/:serialId', async (req, res) => {
   const response= await fetch(`https://assignments.reaktor.com/birdnest/pilots/${req.params.serialId}`)
   const content = await response.json();
   res.send(content);
})

module.exports = pilotsRouter