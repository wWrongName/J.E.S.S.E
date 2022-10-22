const MODE = process.env.NODE_ENV || 'development'

module.exports = {
    window : {
        minWAside : 100,
        minWPages : 200,
        renderingChunkSize : 50000,
    },
    path_history_size : 10,
    mode : MODE,
    port : 1234
}