module.exports = function (sequelize, DataTypes) {
  const board = sequelize.define("Board", {
    title: {
      type: DataTypes.STRING(1000),
      allowNull: false,
    },
    contents: {
      type: DataTypes.STRING(1000),
      allowNull: false,
    },
  });
  return board;
};
