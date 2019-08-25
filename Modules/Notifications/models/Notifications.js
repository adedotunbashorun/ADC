'use strict';
module.exports = (sequelize, DataTypes) => {
    const Notifications = sequelize.define('Notifications', {
        name: {
            type: DataTypes.STRING
        },
        type: {
            type: DataTypes.STRING
        },
        data: {
            type: DataTypes.STRING
        },
    }, {});
    Notifications.associate = function (models) {
        // associations can be defined here
    };
    return Notifications;
};