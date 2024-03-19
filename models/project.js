module.exports = function (sequelize, DataTypes) {
  const project = sequelize.define("Project", {
    name: {
      type: DataTypes.STRING(20),
      allowNull: false,
    },
    imageUrl: {
      type: DataTypes.STRING(300),
      allowNull: false,
    },
    hubUrl: {
      type: DataTypes.STRING(200),
      allowNull: false,
    },
  });
  return project;
};
