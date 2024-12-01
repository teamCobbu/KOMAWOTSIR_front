import React, { useState } from "react";
import { TiChevronLeftOutline, TiChevronRightOutline } from "react-icons/ti";
import {
  CardContainer,
  CardStyled,
  CarouselWrapper,
  NavigationButton,
} from "../components/common/CarouselStyle1";
import thumbnail from "../images/thumbnail.png";

interface ImageDto {
  id: number;
  category: "SOLID" | "GRADATION" | "SEASON" | "CUSTOM";
  name: string;
  pic: string;
  isFront: boolean;
  sourceType: "SERVICE" | "USER";
  userId?: number;
}

// 임시 데이터
const images: ImageDto[] = [
  {
    id: 1,
    category: "SOLID",
    name: "Solid Image",
    pic: "",
    isFront: true,
    sourceType: "SERVICE",
  },
  {
    id: 2,
    category: "GRADATION",
    name: "Gradient Image",
    pic: "",
    isFront: false,
    sourceType: "USER",
    userId: 123,
  },
  {
    id: 3,
    category: "SEASON",
    name: "Season Image",
    pic: "",
    isFront: true,
    sourceType: "SERVICE",
  },
  {
    id: 4,
    category: "SOLID",
    name: "Solid Image",
    pic: "",
    isFront: true,
    sourceType: "SERVICE",
  },
  {
    id: 5,
    category: "GRADATION",
    name: "Gradient Image",
    pic: "",
    isFront: false,
    sourceType: "USER",
    userId: 123,
  },
  {
    id: 6,
    category: "SEASON",
    name: "Season Image",
    pic: "",
    isFront: true,
    sourceType: "SERVICE",
  },
];

const Carousel1: React.FC = () => {
  const [active, setActive] = useState(0);

  const count = images.length;

  return (
    <CarouselWrapper>
      {active > 0 && (
        <NavigationButton
          direction="left"
          onClick={() => setActive((i) => i - 1)}
        >
          <TiChevronLeftOutline />
        </NavigationButton>
      )}
      {images.map((image, i) => (
        <CardContainer
          key={image.id}
          offset={(active - i) / 3}
          absOffset={Math.abs(active - i) / 3}
          direction={Math.sign(active - i)}
          active={i === active}
        >
          <CardStyled absOffset={Math.abs(active - i) / 3}>
            <img
              src={thumbnail}
              alt={image.name}
              style={{ width: "100%", borderRadius: "1rem" }}
            />
            <h2>{image.name}</h2>
            <p>{image.category}</p>
          </CardStyled>
        </CardContainer>
      ))}
      {active < count - 1 && (
        <NavigationButton
          direction="right"
          onClick={() => setActive((i) => i + 1)}
        >
          <TiChevronRightOutline />
        </NavigationButton>
      )}
    </CarouselWrapper>
  );
};

export default Carousel1;
