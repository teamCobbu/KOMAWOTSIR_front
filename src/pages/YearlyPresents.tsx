import axios from "axios";
import html2canvas from "html2canvas";
import { useEffect, useRef, useState } from "react";
import ReactCardFlip from "react-card-flip";
import Modal from "react-modal";
import styled from "styled-components";
import ButtonS from "../components/common/ButtonS";
import Description from "../components/common/Description";
import { IPresent } from "../fetcher";
import { Title } from "../StyledComponents";

const CardStack = styled.div`
  position: relative;
  width: 70%;
  height: 80%;
  margin: 0 auto;
  perspective: 1000px; /* 3D 효과를 위한 원근 */
`;

const Card = styled.div`
  position: absolute;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
  transition: transform 0.3s ease, box-shadow 0.3s ease;
  cursor: pointer;
  transform-origin: center; /* 회전 중심 */
  &:hover {
    transform: scale(1.5);
    box-shadow: 0 6px 10px rgba(0, 0, 0, 0.2);
  }
`;

const YearlyPresents = () => {
  const userId = parseInt(sessionStorage.getItem("userId") || "0");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedCard, setSelectedCard] = useState<IPresent>();
  const [cardData, setCards] = useState<IPresent[]>([]);

  const [isFlipped, setIsFlipped] = useState<boolean>(false);
  const flipCard = () => {
    setIsFlipped(!isFlipped);
  };
  const captureRefs = useRef<HTMLDivElement | null>();

  const year = new Date().getFullYear();
  useEffect(() => {
    axios
      .get<IPresent[]>(`/api/receivers/${userId}/posts/2025`)
      .then((response) => {
        setCards(response.data);
      })
      .catch((error) => {
        console.error("연하장 목록 불러오기 실패:", error);
      });
  }, []);

  const handleDownload = async () => {
    const targetRef = captureRefs.current;
    if (targetRef) {
      const canvas = await html2canvas(targetRef, {
        useCORS: true, // CORS 사용
        allowTaint: false, // Cross-Origin 이미지를 제대로 처리
      });
      const dataURL = canvas.toDataURL("image/png"); // PNG 형식 이미지
      const link = document.createElement("a");
      link.href = dataURL;
      link.download = `present.png`;
      link.click();
    }
  };

  const selectCard = (i: number) => {
    setSelectedCard(cardData[i]);
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setIsFlipped(false);
  };

  return (
    <>
      <Title>올해 받은 연하장</Title>
      {cardData.length === 0 ? (
        <h2>도착한 연하장이 없어요 ㅠㅠ</h2>
      ) : (
        <div>
          <br />
          <Description>읽고 싶은 연하장을 클릭해보세요!</Description>
          <br />
          <br />
          <br />
          <br />
          <CardStack>
            {cardData?.map((card, i) => (
              <Card
                key={card.postId}
                style={{
                  transform: `rotateX(-20deg) rotateY(-35deg)  
                  translateZ(${i * 50}px) translateX(${i * -10}px) translateY(${
                    i * +30
                  }px)`,
                }}
                onClick={() => {
                  selectCard(i);
                }}
              >
                <div
                  style={{
                    width: "15rem",
                    height: "10rem",
                    backgroundImage: `url(${card?.front})`,
                    backgroundSize: "cover",
                    backgroundPosition: "center",
                  }}
                >
                  <span style={{ backgroundColor: "pink", margin: "5px" }}>
                    From.{card.sender}
                  </span>
                </div>
              </Card>
            ))}
          </CardStack>
        </div>
      )}

      <Modal
        isOpen={isModalOpen}
        style={{
          content: {
            top: "50%",
            left: "50%",
            right: "auto",
            bottom: "auto",
            marginRight: "-50%",
            transform: "translate(-50%, -50%)",
            background: "transparent", // 배경색 제거
            border: "none", // 경계선 제거
            padding: "0", // 내부 여백 제거
            width: "auto",
            height: "auto",
            overflow: "hidden",
          },
        }}
        ariaHideApp={false} // 접근성 경고 비활성화
      >
        <ReactCardFlip isFlipped={isFlipped} flipDirection="horizontal">
          {/* 앞면 */}
          <div>
            <div
              style={{
                width: "21rem",
                height: "14rem",
                backgroundImage: `url(${selectedCard?.front})`,
                backgroundSize: "cover",
                backgroundPosition: "center",
              }}
            ></div>
            <ButtonS onClick={() => setIsModalOpen(false)} category="gray">
              닫기
            </ButtonS>
            <ButtonS onClick={() => flipCard()} category="pink">
              편지 읽기
            </ButtonS>
          </div>

          {/* 뒷면 */}
          <div>
            <div ref={(el) => (captureRefs.current = el)}>
              <div
                style={{
                  width: "21rem",
                  height: "14rem",
                  backgroundImage: `url(${selectedCard?.back})`,
                  backgroundSize: "cover",
                  backgroundPosition: "center",
                  display: "flex",
                }}
              ></div>
            </div>
            <ButtonS onClick={() => closeModal()} category="gray">
              닫기
            </ButtonS>
            <ButtonS onClick={() => flipCard()} category="hotpink">
              앞면 보기
            </ButtonS>
          </div>
        </ReactCardFlip>
      </Modal>
    </>
  );
};

export default YearlyPresents;
