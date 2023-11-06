const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');

const app = express();
const port = 3000;

// Serve static files from the "public" directory
app.use(express.static('public'));

mongoose.connect('mongodb://127.0.0.1:27017/mediaplayer', { useNewUrlParser: true, useUnifiedTopology: true });

const songSchema = new mongoose.Schema({
    title: String,
    liked: Boolean,
    likes: Number,
});

const Song = mongoose.model('Song', songSchema);

app.use(bodyParser.json());
app.post('/api/like-song', async (req, res) => {
    try {
        const { title, liked } = req.body;
        let song = await Song.findOne({ title });

        if (!song) {
            song = new Song({ title, liked, likes: 0 });
        }

        if (liked) {
            if (!song.liked) {
                song.liked = true;  // Set liked to true if not already liked
                song.likes++;       // Increment likes count
            }
        } else {
            if (song.liked) {
                song.liked = false; // Set liked to false if not already unliked
                song.likes--;       // Decrement likes count
            }
        }

        await song.save();

        res.json({ message: 'Song like status updated successfully' });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Server error' });
    }
});

app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
});
