'use strict';
module.exports = (sequelize, DataTypes) => {
    const Core = sequelize.define('Core', {
        name: {
            type: DataTypes.INTEGER
        },
    }, {});
    Core.associate = function (models) {
        // associations can be defined here
    };
    return Core;
};