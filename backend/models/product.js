'use strict';
module.exports = (sequelize, DataTypes) => {
  const Product = sequelize.define('Product', {
    id: {
      type: DataTypes.UUID,
      defaultValue: sequelize.literal('gen_random_uuid()'),
      primaryKey: true
    },
    name: DataTypes.STRING,
    price: DataTypes.INTEGER,
    stock: DataTypes.INTEGER,
    category_id: {
      type: DataTypes.UUID,
      allowNull: true
    }
  }, {
    tableName: 'products',
    underscored: true
  });

  Product.associate = function(models) {
    Product.belongsTo(models.Category, { foreignKey: 'category_id', as: 'category' });
  };

  return Product;
};
