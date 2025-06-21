import React, { useEffect, useState } from 'react';
import { Select, Dropdown, Typography, Space } from 'antd';
import { DownOutlined } from '@ant-design/icons';
import { Country, State, City } from 'country-state-city';
import { useSearch } from '../utils/SearchContext';

const { Option } = Select;

export function DropdownFilter({ type = 'lost' }) {
  const [items, setItems] = useState([]);

  const {
    category,
    setCategory,
    foundCategory,
    setFoundCategory,
  } = useSearch();

  const currentCategory = type === 'found' ? foundCategory : category;
  const setCurrentCategory = type === 'found' ? setFoundCategory : setCategory;

  useEffect(() => {
    const categories = [
      'All',
      'electronics',
      'financial',
      'education',
      'groceries',
      'clothes',
      'automobile',
      'person',
      'pet',
      'sports',
      'documents',
      'accessories',
      'gadgets',
      'toys',
      'tools',
      'stationery',
      'footwear',
      'medication',
      'art',
      'baggage',
      'home_appliances',
      'others',
    ];

    setItems(
      categories.map((label, index) => ({
        key: String(index),
        label: label.charAt(0).toUpperCase() + label.slice(1).replace(/_/g, ' '),
      }))
    );
  }, []);

  const handleMenuClick = (e) => {
    const selectedItem = items.find((item) => item.key === e.key);
    if (selectedItem) {
      setCurrentCategory(selectedItem.label);
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
          {currentCategory}
          <DownOutlined />
        </Space>
      </Typography.Link>
    </Dropdown>
  );
}

export function CountryDropdown({ type = 'lost' }) {
  const countryOptions = Country.getAllCountries().map((country) => ({
    label: country.name,
    value: country.isoCode,
  }));

  const {
    country,
    setCountry,
    foundCountry,
    setFoundCountry,
    setState,
    setFoundState,
    setCity,
    setFoundCity,
  } = useSearch();

  const currentCountry = type === 'found' ? foundCountry : country;
  const setCurrentCountry = type === 'found' ? setFoundCountry : setCountry;
  const setCurrentState = type === 'found' ? setFoundState : setState;
  const setCurrentCity = type === 'found' ? setFoundCity : setCity;

  const handleCountryChange = (value) => {
    setCurrentCountry(value);
    setCurrentState(undefined);
    setCurrentCity(undefined);
  };

  return (
    <Select
      showSearch
      placeholder="Select Country"
      value={currentCountry}
      onChange={handleCountryChange}
      options={countryOptions}
      className="min-w-[20%]"
      filterOption={(input, option) =>
        option.label.toLowerCase().includes(input.toLowerCase())
      }
    />
  );
}

export function StateDropdown({ type = 'lost' }) {
  const {
    country,
    state,
    setState,
    foundCountry,
    foundState,
    setFoundState,
    setCity,
    setFoundCity,
  } = useSearch();

  const currentCountry = type === 'found' ? foundCountry : country;
  const currentState = type === 'found' ? foundState : state;
  const setCurrentState = type === 'found' ? setFoundState : setState;
  const setCurrentCity = type === 'found' ? setFoundCity : setCity;

  const stateOptions = State.getStatesOfCountry(currentCountry || '').map(
    (state) => ({
      label: state.name,
      value: state.isoCode,
    })
  );

  const handleStateChange = (value) => {
    setCurrentState(value);
    setCurrentCity(undefined);
  };

  return (
    <Select
      showSearch
      placeholder="Select State"
      value={currentState}
      onChange={handleStateChange}
      options={stateOptions}
      disabled={!currentCountry}
      className="min-w-[20%]"
      filterOption={(input, option) =>
        option.label.toLowerCase().includes(input.toLowerCase())
      }
    />
  );
}

export function CityDropdown({ type = 'lost' }) {
  const {
    country,
    state,
    city,
    setCity,
    foundCountry,
    foundState,
    foundCity,
    setFoundCity,
  } = useSearch();

  const currentCountry = type === 'found' ? foundCountry : country;
  const currentState = type === 'found' ? foundState : state;
  const currentCity = type === 'found' ? foundCity : city;
  const setCurrentCity = type === 'found' ? setFoundCity : setCity;

  const cityOptions = City.getCitiesOfState(currentCountry || '', currentState || '').map(
    (city) => ({
      label: city.name,
      value: city.name,
    })
  );

  return (
    <Select
      showSearch
      placeholder="Select City"
      value={currentCity}
      onChange={(value) => setCurrentCity(value)}
      options={cityOptions}
      disabled={!currentState}
      className="min-w-[20%]"
      filterOption={(input, option) =>
        option.label.toLowerCase().includes(input.toLowerCase())
      }
    />
  );
}
