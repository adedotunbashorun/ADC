'use strict';
module.exports = (sequelize, DataTypes) => {
    const ActivityLog = sequelize.define('ActivityLog', {
        name: {
            type: DataTypes.INTEGER
        },
    }, {});
    ActivityLog.associate = function (models) {
        // associations can be defined here
    };
    return ActivityLog;
};