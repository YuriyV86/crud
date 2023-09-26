console.clear()

// Підключаємо технологію express для back-end сервера
const express = require('express')
// Cтворюємо роутер - місце, куди ми підключаємо ендпоїнти
const router = express.Router()

// ================================================================

// classes

class Track {
  static #list = []

  constructor(name, author, image) {
    this.id = Math.floor(1000 + Math.random() * 9000)
    this.name = name
    this.author = author
    this.image = image
  }

  static create(name, author, image) {
    const newTrack = new Track(name, author, image)
    this.#list.push(newTrack)
    return newTrack
  }

  static getList() {
    return this.#list.reverse()
  }

  static getById(id) {
    return (
      Track.#list.find((track) => track.id === id) || null
    )
  }
}

class Playlist {
  static #list = []

  constructor(name) {
    this.id = Math.floor(1000 + Math.random() * 9000)
    this.name = name
    this.tracks = []
    this.image = `http://picsum.photos/300/300`
  }

  static create(name) {
    const newPlaylist = new Playlist(name)

    this.#list.push(newPlaylist)
    return newPlaylist
  }

  static getList() {
    return this.#list.reverse()
  }

  static makeMix(playlist) {
    const allTracks = Track.getList()

    let randomTracks = allTracks
      .sort(() => 0.5 - Math.random())
      .slice(0, 3)

    playlist.tracks.push(...randomTracks)
  }

  static getById(id) {
    return (
      Playlist.#list.find(
        (playlist) => playlist.id === id,
      ) || null
    )
  }

  deleteTrackById(trackId) {
    this.tracks = this.tracks.filter(
      (track) => track.id !== trackId,
    )
  }

  static findListByValue(name) {
    return this.#list.filter((playlist) =>
      playlist.name
        .toLowerCase()
        .includes(name.toLowerCase()),
    )
  }

  addTrackById(trackId) {
    const track = Track.getById(trackId)

    if (track) {
      this.tracks.push(track)
    }
  }
}

// ================================================================
Track.create(
  'Інь-янь',
  `Monatik`,
  'http://picsum.photos/100/100',
)

Track.create(
  'Baila',
  `Selena Gomez`,
  'http://picsum.photos/100/100',
)

Track.create(
  'Shamless',
  `Camila`,
  'http://picsum.photos/100/100',
)

Track.create(
  'DAKITI',
  `Bad Bunny`,
  'http://picsum.photos/100/100',
)

Track.create(
  '11 PM',
  `Maluma`,
  'http://picsum.photos/100/100',
)

Track.create(
  'Інша любов',
  `Enleo`,
  'http://picsum.photos/100/100',
)

Playlist.makeMix(Playlist.create('Пісні, що сподобались'))
Playlist.makeMix(Playlist.create('Спільний альбом'))
Playlist.makeMix(Playlist.create('Інь Ян'))
// ================================================================

// router.get Створює нам один ентпоїнт
// ↙️ тут вводимо шлях (PATH) до сторінки

router.get('/', function (req, res) {
  const trackList = Playlist.getList()

  res.render('spotify-overview', {
    style: 'spotify-overview',
    data: {
      list: trackList.map(({ tracks, ...rest }) => ({
        ...rest,
        amount: tracks.length,
      })),
    },
  })
})

router.get('/spotify-choose', function (req, res) {
  res.render('spotify-choose', {
    style: 'spotify-choose',
    data: {},
  })
})

router.get('/spotify-create', function (req, res) {
  const isMix = !!req.query.isMix

  res.render('spotify-create', {
    style: 'spotify-create',
    data: { isMix },
  })
})

router.post('/spotify-create', function (req, res) {
  const isMix = !!req.query.isMix
  const name = req.body.name

  if (!name) {
    return res.render('alert', {
      style: 'alert',
      success: false,
      info: 'Введіть назву плейліста',
      link: isMix
        ? `/spotify-create?isMix=true`
        : '/spotify-create',
    })
  }

  const playlist = Playlist.create(name)

  if (isMix) {
    Playlist.makeMix(playlist)
  }

  // console.log(playlist)

  res.render('spotify-playlist', {
    style: 'spotify-playlist',
    data: {
      playlistId: playlist.id,
      tracks: playlist.tracks,
      name: playlist.name,
    },
  })
})

router.get('/spotify-playlist', function (req, res) {
  const id = Number(req.query.id)

  const playlist = Playlist.getById(id)

  if (!playlist) {
    return res.render('alert', {
      style: 'alert',
      success: false,
      info: 'Плейліст не знайдено',
      link: '/',
    })
  }

  res.render('spotify-playlist', {
    style: 'spotify-playlist',
    data: {
      playlistId: playlist.id,
      tracks: playlist.tracks,
      name: playlist.name,
    },
  })
})

router.get('/spotify-track-delete', function (req, res) {
  const playlistId = Number(req.query.playlistId)
  const trackId = Number(req.query.trackId)

  const playlist = Playlist.getById(playlistId)

  if (!playlist) {
    return res.render('alert', {
      style: 'alert',
      success: false,
      info: 'Плейліст не знайдено',
      link: `/spotify-playlist?id=${playlistId}`,
    })
  }

  playlist.deleteTrackById(trackId)

  res.render('spotify-playlist', {
    style: 'spotify-playlist',
    data: {
      playlistId: playlist.id,
      tracks: playlist.tracks,
      name: playlist.name,
    },
  })
})

router.get('/spotify-search', function (req, res) {
  const value = ''

  const list = Playlist.findListByValue(value)

  res.render('spotify-search', {
    style: 'spotify-search',
    data: {
      list: list.map(({ tracks, ...rest }) => ({
        ...rest,
        amount: tracks.length,
      })),
      value,
    },
  })
})

router.post('/spotify-search', function (req, res) {
  const value = req.body.value || ''

  const list = Playlist.findListByValue(value)

  res.render('spotify-search', {
    style: 'spotify-search',
    data: {
      list: list.map(({ tracks, ...rest }) => ({
        ...rest,
        amount: tracks.length,
      })),
      value,
    },
  })
})

router.get('/spotify-playlist-add', function (req, res) {
  const playlistId = Number(req.query.playlistId)

  const playlist = Playlist.getById(playlistId)

  res.render('spotify-playlist-add', {
    style: 'spotify-playlist-add',
    data: {
      playlistId: playlistId,
      tracks: Track.getList(),
      name: playlist.name,
    },
  })
})

router.get('/spotify-track-add', function (req, res) {
  const playlistId = Number(req.query.playlistId)
  const trackId = Number(req.query.trackId)

  const playlist = Playlist.getById(playlistId)

  if (!playlist) {
    return res.render('alert', {
      style: 'alert',
      success: false,
      info: 'Плейліст не знайдено',
      link: `/spotify-playlist?id=${playlistId}`,
    })
  }

  playlist.addTrackById(trackId)

  res.render('spotify-playlist', {
    style: 'spotify-playlist',
    data: {
      playlistId: playlist.id,
      tracks: playlist.tracks.reverse(),
      name: playlist.name,
    },
  })
})
// ================================================================

// Підключаємо роутер до бек-енду
module.exports = router
