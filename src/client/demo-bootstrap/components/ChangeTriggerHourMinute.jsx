import React, { useState, useEffect, useRef } from 'react';
import Button from 'react-bootstrap/Button';
import Form from 'react-bootstrap/Form';
import Container from 'react-bootstrap/Container';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import { FiSave } from 'react-icons/fi';
import useOwner from '../hooks/useOwner';
import LoadingState from './LoadingState';
import { serverFunctions } from '../../utils/serverFunctions';

const ControllPanel = ({ onSave }) => {
  const hourRef = useRef();
  const minuteRef = useRef();
  const onClick = (e) => {
    e.Data = {
      hour: hourRef.current?.value,
      minute: minuteRef.current?.value,
    };
    onSave(e);
  };
  return (
    <Container>
      <Row className="h1 text-center text-md-start">通知時間調整</Row>
      <Row>
        <Col className="my-auto col-5 d-md-flex flex-row">
          <Form.Label
            htmlFor="trigger-hour"
            class="d-none d-md-block my-auto text-nowrap"
          >
            請選擇要
          </Form.Label>
          <Form.Select ref={hourRef} id="trigger-hour">
            <option>幾點</option>
            <option value="6">早上6點</option>
            <option value="7">早上7點</option>
            <option value="8">早上8點</option>
            <option value="9">早上9點</option>
            <option value="10">早上10點</option>
            <option value="11">早上11點</option>
            <option value="12">中午12點</option>
            <option value="13">下午1點</option>
            <option value="14">下午2點</option>
            <option value="15">下午3點</option>
            <option value="16">下午4點</option>
            <option value="17">下午5點</option>
            <option value="18">晚上6點</option>
            <option value="19">晚上7點</option>
            <option value="20">晚上8點</option>
            <option value="21">晚上9點</option>
          </Form.Select>
        </Col>
        <Col className="my-auto col-4 d-md-flex flex-row">
          <Form.Select ref={minuteRef} id="trigger-minute">
            <option>幾分</option>
            <option value="0">整點</option>
            <option value="5">5分</option>
            <option value="10">10分</option>
            <option value="15">15分</option>
            <option value="20">20分</option>
            <option value="25">25分</option>
            <option value="30">半點</option>
            <option value="35">35分</option>
            <option value="40">40分</option>
            <option value="45">45分</option>
            <option value="50">50分</option>
            <option value="55">55分</option>
          </Form.Select>
          <Form.Label
            htmlFor="trigger-minute"
            class="d-none d-md-block my-auto text-nowrap"
          >
            通知
          </Form.Label>
        </Col>
        <Col className="my-auto col-2">
          <Button
            variant="primary"
            className="d-md-flex flex-row"
            onClick={onClick}
          >
            <FiSave className="my-auto mx-1"></FiSave>
            <span className="d-none d-md-block">儲存</span>
          </Button>
        </Col>
      </Row>
    </Container>
  );
};

const ChangeTriggerHourMinute = () => {
  const [time, setTime] = useState(null);

  const { isOwner } = useOwner();

  useEffect(() => {
    if (time) {
      const { hour, minute } = time;
      // console.debug('setDailyNotification', hour, minute);
      serverFunctions
        .setDailyNotification(hour, minute)
        .then((res) => {
          console.debug(res);
        })
        .catch((err) => {
          console.error(err.message, err.stack);
        });
    }
  }, [time]);

  return (
    <LoadingState done={isOwner !== null}>
      <p>專案擁有者:{isOwner ? '是' : '不是'}</p>
      {isOwner && (
        <ControllPanel onSave={(e) => setTime(e.Data)}></ControllPanel>
      )}
    </LoadingState>
  );
};

export default ChangeTriggerHourMinute;
