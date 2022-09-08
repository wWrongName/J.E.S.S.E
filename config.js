const MODE = process.env.NODE_ENV || 'development'

module.exports = {
    window : {
        minWAside : 100,
        minWPages : 530,
    },
    mode : MODE,
    port : 1234
}