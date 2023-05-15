import { Button, Checkbox, Radio, RadioChangeEvent } from "antd";
import React, { useEffect, useState } from "react";
import { AiOutlineClose } from "react-icons/ai";
import { Slider } from "antd";

const categories = ["Electronics", "Clothes", "Home Appliance", "Others"];

const Filters = ({ showFilters, setShowFilters, filters, setFilters }: any) => {
  const [selectedCategory, setSelectedCategory] = useState<string[]>([]);
  const [selectedRange, setSelectedRange] = useState<[number, number]>([0, 25]);

  useEffect(() => {
    console.log(filters);
  }, [filters]);

  const handleCategoryChange = (category: string) => {
    setSelectedCategory((prevSelectedCategory) =>
      prevSelectedCategory.includes(category)
        ? prevSelectedCategory.filter((c) => c !== category)
        : [...prevSelectedCategory, category]
    );
  };

  function handleSliderChange(value: [number, number]) {
    setSelectedRange(value);
  }

  const applyFilters = () => {
    setFilters({ ...filters, category: selectedCategory, age: selectedRange });
  };

  return (
    <div className="w-80 flex flex-col gap-6 h-screen items-start max-h-[450px]">
      <div className="flex justify-between items-center">
        <h1>Filters</h1>
        <Button
          onClick={() => setShowFilters(false)}
          className="hover:opacity-60 transition-all "
          type="ghost">
          <AiOutlineClose className="text-xl" />
        </Button>
      </div>
      <div className="flex flex-col gap-3 mt-3">
        <h2>Categories</h2>
        {categories.map((category) => (
          <Checkbox
            className="text-left"
            key={category}
            onChange={() => handleCategoryChange(category)}
            checked={selectedCategory.includes(category)}>
            {category}
          </Checkbox>
        ))}
      </div>
      <div className="flex items-start flex-col gap-4">
        <h2>Age</h2>
        <Slider
          className="min-w-[150px]"
          range
          value={selectedRange}
          defaultValue={[0, 25]}
          onChange={handleSliderChange}
          marks={{
            0: "0",
            5: "5",
            10: "10",
            15: "15",
            20: "20",
            25: "25",
          }}
          max={25}
        />
      </div>
      <Button
        type="primary"
        onClick={applyFilters}
        className="mt-6">
        Apply filters
      </Button>
    </div>
  );
};

export default Filters;
