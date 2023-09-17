import { gql, useMutation, Reference } from "@apollo/client"
import { Form, Input, InputNumber, Modal } from "antd"
import { FC, useRef } from "react"

interface IProps {
  open: boolean
  handleCancel: () => void
}

type FieldType = {
  name: string
  price: number
  stock: number
  description: string
}

const ADD_PRODUCT = gql`
  mutation AddProduct($name: String!, $description: String!, $price: numeric!, $stock: Int!) {
    insert_products_one(object: {
      name: $name,
      description: $description,
      price: $price,
      stock: $stock
    }) {
      id
    }
  }
`;

const AddProductModal: FC<IProps> = (props) => {
  const { open, handleCancel } = props
  const submitBtn = useRef<HTMLButtonElement | null>(null)

  const [addProduct] = useMutation(ADD_PRODUCT, {
    update(cache, { data }) {
      // Update the products list in the cache with the newly added product
      const newProduct = data?.insert_products_one;
      if (newProduct) {
        cache.modify({
          fields: {
            products(existingProducts) {
              // Use a type assertion here to specify the correct type
              return [...(existingProducts as Reference[]), newProduct];
            },
          },
        });
      }
    },
  });


  const handleFinish = async (values: FieldType) => {
    try {
      await addProduct({
        variables: {
          name: values.name,
          description: values.description,
          price: Number(values.price),
          stock: values.stock,
        },
      });

      alert("Product added successfully.");
      handleCancel();
    } catch (error) {
      console.error("Failed to add the product:", error);
    }
  };

  const onOk = () => {
    submitBtn?.current?.click()
  }

  return (
    <Modal
      title="Add Product"
      open={open}
      onOk={onOk}
      onCancel={handleCancel}
      destroyOnClose
    >
      <Form name="AddProduct" onFinish={handleFinish} layout="vertical">
        <Form.Item<FieldType>
          label="Product Name"
          name="name"
          rules={[{ required: true, message: 'Please input product name!' }]}
        >
          <Input />
        </Form.Item>

        <Form.Item<FieldType>
          label="Product Description"
          name="description"
          rules={[{ required: true, message: 'Please input product description!' }]}
        >
          <Input />
        </Form.Item>

        <Form.Item<FieldType>
          label="Product Price"
          name="price"
          rules={[{ required: true, message: 'Please input product price!' }]}
        >
          <InputNumber style={{ width: '100%' }} />
        </Form.Item>

        <Form.Item<FieldType>
          label="Initial Stock"
          name="stock"
          rules={[{ required: true, message: 'Please input initial stock!' }]}
        >
          <InputNumber style={{ width: '100%' }} />
        </Form.Item>
        <button ref={submitBtn} type="submit" style={{ display: 'none' }}>Submit</button>
      </Form>
    </Modal>
  )
}

export default AddProductModal