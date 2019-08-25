'use strict';
module.exports = (sequelize, DataTypes) => {
    const Authentication = sequelize.define('Authentication', {
        name: {
            type: DataTypes.INTEGER
        },
    }, {});
    Authentication.associate = function (models) {
        // associations can be defined here
    };
    return Authentication;
};