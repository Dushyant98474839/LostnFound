import React, { useState } from 'react';
import { DownOutlined } from '@ant-design/icons';
import { Dropdown, Space, Typography } from 'antd';

const items = [
  {
    key: '0',
    label: 'Category',
  },
  {
    key: '1',
    label: 'Item 1',
  },
  {
    key: '2',
    label: 'Item 2',
  },
  {
    key: '3',
    label: 'Item 3',
  },
];

function DropdownFilter(className="") {
  const [category, setCategory] = useState('Category');

  const handleMenuClick = (e) => {
    const selectedItem = items.find((item) => item.key === e.key);
    if (selectedItem) {
      setCategory(selectedItem.label);
    }
  };

  return (
    <>
      <Dropdown className={`${className}`}
        menu={{
          items,
          selectable: true,
          defaultSelectedKeys: ['0'],
          onClick: handleMenuClick,
        }}
      >
        <Typography.Link onClick={(e) => e.preventDefault()}>
          <Space>
            {category}
            <DownOutlined />
          </Space>
        </Typography.Link>
      </Dropdown>
    </>
  );
}



import { Select } from 'antd';

const { Option } = Select;

const cities = [
  "Mumbai", "Delhi", "Bengaluru", "Hyderabad", "Ahmedabad",
  "Chennai", "Kolkata", "Pune", "Jaipur", "Lucknow"
];

function CityDropdown({ value, onChange }) {
  return (
    <Select
      showSearch
      placeholder="Select a city"
      optionFilterProp="children"
      value={value}
      onChange={onChange}
      className=""
      filterOption={(input, option) =>
        option.children.toLowerCase().includes(input.toLowerCase())
      }
    >
      {cities.map((city) => (
        <Option key={city} value={city}>
          {city}
        </Option>
      ))}
    </Select>
  );
}


const { Option2 } = Select;

const countries = [
  "India", "United States", "United Kingdom", "Canada", "Australia",
  "Germany", "France", "Japan", "China", "Brazil", "South Africa"
];

function CountryDropdown({ value, onChange }) {
  return (
    <Select
      showSearch
      placeholder="Select a country"
      optionFilterProp="children"
      value={value}
      onChange={onChange}
      className=""
      filterOption={(input, option) =>
        option.children.toLowerCase().includes(input.toLowerCase())
      }
    >
      {countries.map((country) => (
        <Option key={country} value={country}>
          {country}
        </Option>
      ))}
    </Select>
  );
}


export {DropdownFilter,CityDropdown,CountryDropdown};
