import { gql, useQuery } from '@apollo/client';
import { Button, Card, Space, Table } from 'antd'
import Statistic from 'antd/es/statistic/Statistic';
import { ProductDataType, ProductListData } from './types/products.type';
import type { ColumnsType } from 'antd/es/table';
import './Products.css'
import AddProductModal from './components/Products/AddProductModal';
import { useState } from 'react';

const countQuery = gql`
  query CountQuery {
    products {
      id
      name
      price
      stock
      description
    }
    products_aggregate {
      aggregate {
        count
      }
    }
  }
`

export function Products(): JSX.Element {

  const { data, loading } = useQuery<ProductListData, {}>(countQuery);

  const [isModalOpen, setIsModalOpen] = useState(false)

  const totalPrice = data?.products?.reduce((acc, product) => {
    return acc + (product.price * product.stock);
  }, 0);

  const columns: ColumnsType<ProductDataType> = [
    {
      "title": "#",
      "dataIndex": "index",
      "key": "index"
    },
    {
      "title": "Name",
      "dataIndex": "name",
      "key": "name"
    },
    {
      "title": "Description",
      "dataIndex": "description",
      "key": "description"
    },
    {
      "title": "Price",
      "dataIndex": "price",
      "key": "price"
    },
    {
      "title": "Stock",
      "dataIndex": "stock",
      "key": "stock"
    },
  ]

  const rows: ProductDataType[] = data?.products?.map((product, index) => ({
    key: product?.id,
    index: index + 1,
    name: product?.name,
    description: product?.description,
    price: product?.price,
    stock: product?.stock
  })) ?? []

  const handleModalCancel = () => {
    setIsModalOpen(false)
  }

  if (loading) {
    return <p>Loading ...</p>
  }

  return (
    <div>
      <Space>
        <Card bordered={false}>
          <Statistic title="Total products" value={data?.products_aggregate?.aggregate.count} />
        </Card>
        <Card bordered={false}>
          <Statistic title="Total Price" value={totalPrice?.toFixed(2)} />
        </Card>
      </Space>

      <div className='product__add'>
        <Button type='primary' onClick={() => setIsModalOpen(true)}>Add Product</Button>
      </div>
      <Table columns={columns} dataSource={rows} style={{ marginTop: '1rem' }} />

      <AddProductModal open={isModalOpen} handleCancel={handleModalCancel} />
    </div>
  );
}
