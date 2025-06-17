import React from 'react';
import { Select, Dropdown, Typography, Space } from 'antd';
import { DownOutlined } from '@ant-design/icons';
import { Country, State, City } from 'country-state-city';

const { Option } = Select;

const items = [
  { key: '0', label: 'Category' },
  { key: '1', label: 'Item 1' },
  { key: '2', label: 'Item 2' },
  { key: '3', label: 'Item 3' },
];

export function DropdownFilter() {
  const [category, setCategory] = React.useState('Category');

  const handleMenuClick = (e) => {
    const selectedItem = items.find((item) => item.key === e.key);
    if (selectedItem) {
      setCategory(selectedItem.label);
    }
  };

  return (
    <Dropdown
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
  );
}

export function CountryDropdown({ value, onChange }) {
  const countryOptions = Country.getAllCountries().map((country) => ({
    label: country.name,
    value: country.isoCode,
  }));

  return (
    <Select
      showSearch
      placeholder="Select Country"
      value={value}
      onChange={onChange}
      options={countryOptions}
      className="min-w-[20%]"
      filterOption={(input, option) =>
        option.label.toLowerCase().includes(input.toLowerCase())
      }
    />
  );
}

export function StateDropdown({ selectedCountryCode, value, onChange }) {
  const stateOptions = State.getStatesOfCountry(selectedCountryCode || "").map((state) => ({
    label: state.name,
    value: state.isoCode,
  }));

  return (
    <Select
      showSearch
      placeholder="Select State"
      value={value}
      onChange={onChange}
      options={stateOptions}
      disabled={!selectedCountryCode}
      className="min-w-[20%]"
      filterOption={(input, option) =>
        option.label.toLowerCase().includes(input.toLowerCase())
      }
    />
  );
}


export function CityDropdown({ selectedCountryCode, selectedStateCode, value, onChange }) {
  const cityOptions = City.getCitiesOfState(selectedCountryCode || "", selectedStateCode || "").map((city) => ({
    label: city.name,
    value: city.name,
  }));

  return (
    <Select
      showSearch
      placeholder="Select City"
      value={value}
      onChange={onChange}
      options={cityOptions}
      disabled={!selectedStateCode}
      className="min-w-[20%]"
      filterOption={(input, option) =>
        option.label.toLowerCase().includes(input.toLowerCase())
      }
    />
  );
}
