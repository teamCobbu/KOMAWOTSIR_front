import { useForm } from "react-hook-form";
import ButtonL from "../components/common/ButtonL";
import Title from "../components/common/Title";
import Form from "../components/common/Form";
import { useQuery } from "react-query";
import { IUserInfoType, loadUserInfo } from "../fetcher";
import styled from "styled-components";
import axios from "axios";
import { useState } from "react";
import Modal from "react-modal";
import ButtonS from "../components/common/ButtonS";
import { useHistory } from "react-router-dom";

const SmsOption = styled.div`
  padding-top: 120px;
  text-align: center;
  font-size: 80%;

  input[type="checkbox"] {
    margin: 0;
    width: auto;
    height: auto;
  }

  div {
    padding: 10px 0;
    font-size: 80%;
    color: #666;
  }
`;

const Withdrawal = styled.span`
  padding-top: 10px;
  text-align: center;
  font-size: 60%;
  color: #666;
`;

export const ModalContent = styled.div`
  text-align: center;
  h3 {
    font-size: 18px;
    margin-bottom: 10px;
  }
  p {
    font-size: 14px;
    color: #666;
    margin-bottom: 20px;
  }
`;

export const customStyles = {
  content: {
    top: "50%",
    left: "50%",
    right: "auto",
    bottom: "auto",
    marginRight: "-50%",
    transform: "translate(-50%, -50%)",
    width: "300px",
    padding: "30px 20px",
    textAlign: "center" as "center",
    borderRadius: "10px",
    boxShadow: "0px 4px 6px rgba(0, 0, 0, 0.1)", // 그림자 추가
    border: "none", // 테두리 제거
    backgroundColor: "#fff",
  },
  overlay: {
    backgroundColor: "rgba(0, 0, 0, 0.5)", // 더 어두운 오버레이
  },
};

function UpdateMyInfo() {
  // userId 임의로 가정하기
  const userId = 5;

  const nav = useHistory();

  const { register, watch, handleSubmit, setValue } = useForm<IUserInfoType>();
  // register: onChange, value, useState를 모두 대체하는 함수!
  // watch: form의 입력값 추적
  // handleSubmit: validation, preventDefault 담당

  const onValid = async (formData: IUserInfoType) => {
    try {
      const response = await axios.put(`/api/users/${userId}`, formData);
      console.log("저장 성공:", response.data);
    } catch (error) {
      console.error("저장 실패:", error);
    }
  };

  const onInvalid = (errors: any) => {};

  const [isConfirmModalOpen, setIsConfirmModalOpen] = useState(false);
  const [isSuccessModalOpen, setIsSuccessModalOpen] = useState(false);

  const openConfirmModal = () => setIsConfirmModalOpen(true);
  const closeConfirmModal = () => setIsConfirmModalOpen(false);
  const closeSuccessModal = () => {
    setIsSuccessModalOpen(false);
    nav.push("/");
  };

  const WithdrawalProc = async () => {
    openConfirmModal();
  };

  const handleWithdrawl = async () => {
    try {
      await axios.delete(`/api/users/${userId}`); // userId를 동적으로 변경 가능
      closeConfirmModal();
      setIsSuccessModalOpen(true); // 성공 모달 열기
    } catch (error) {
      console.error("탈퇴 실패:", error);
      alert("탈퇴 중 오류가 발생했습니다.");
    }
  };

  const { isLoading, data, error } = useQuery<IUserInfoType>(
    ["loadUserInfo", userId],
    () => loadUserInfo(userId),
    {
      onSuccess: (data) => {
        setValue("name", data.name);
        setValue("kakaoId", data.kakaoId);
        setValue("tel", data.tel);
        setValue("isSmsAllowed", data.isSmsAllowed);
      },
    }
  );

  return (
    <>
      <Title>회원정보 수정</Title>
      <Form onSubmit={handleSubmit(onValid, onInvalid)}>
        <label htmlFor="name">이름</label>
        <input
          {...register("name", { required: true })}
          id="name"
          placeholder="이름을 입력하세요"
        />
        <label htmlFor="kakaoId">아이디</label>
        <input {...register("kakaoId", { required: true })} disabled />
        <label htmlFor="tel">전화번호</label>
        <input
          {...register("tel", { required: true })}
          placeholder="- 없이 쓰삼"
        />
        <SmsOption>
          <span>
            <input type="checkbox" {...register("isSmsAllowed")} /> 문자
            메시지로 알림 받기
          </span>
          <div>
            내년 1월 1일 이후에 로그인하여 도착한 연하장을 확인할 수 있어요.
            <br />
            만약 연하장을 확인할 수 있는 별도의 고유 링크가 필요할 경우,
            <br />
            문자 메시지로 알림 받기 옵션을 체크해 주세요.
          </div>
        </SmsOption>
        <ButtonL category="pink">저장하기</ButtonL>
        <Withdrawal onClick={WithdrawalProc}>고마워써 탈퇴하기</Withdrawal>
      </Form>

      <Modal
        isOpen={isConfirmModalOpen}
        onRequestClose={closeConfirmModal}
        style={customStyles}
        ariaHideApp={false}
      >
        <ModalContent>
          <h3>정말 탈퇴하시겠습니까?</h3>
          <p>탈퇴 시 회원 정보와 관련 데이터는 삭제됩니다.</p>
          <ButtonS category="pink" onClick={handleWithdrawl}>
            확인
          </ButtonS>
          &emsp;
          <ButtonS category="pink" onClick={closeConfirmModal}>
            취소
          </ButtonS>
        </ModalContent>
      </Modal>

      <Modal
        isOpen={isSuccessModalOpen}
        onRequestClose={closeSuccessModal}
        style={customStyles}
        ariaHideApp={false}
      >
        <ModalContent>
          <h3>탈퇴 처리가 완료되었습니다.</h3>
          <p>다음에 또 만나요~~~~</p>
          <ButtonS
            category="pink"
            className="confirm"
            onClick={closeSuccessModal}
          >
            닫기
          </ButtonS>
        </ModalContent>
      </Modal>
    </>
  );
}

export default UpdateMyInfo;
