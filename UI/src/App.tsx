import React, { useEffect, useState } from 'react';
import { Container, Row, Col, Button } from 'react-bootstrap';
import mainUrl from './variables';
import { io } from "socket.io-client"
import './App.css';
import GaugeComponent from './lib';
import CONSTANTS from './lib/GaugeComponent/constants';
import But from './components/buttos';
import { flow, set } from 'lodash';
const App = () => {
  const [dataR, setdataR] = useState({
    valve: false,
    flowValue: 22
  })
  const [valveChanger, setChangeValve] = useState(dataR.valve)
  const [isMounted, setIsMounted] = useState(false);
  useEffect(() => {
    const changeData = async () => {
      const response = await (await fetch(`${mainUrl}/flow/changeValve/${!dataR.valve}`)).json()
      console.log(response);
      
      if (response.success) {
        if (response.body) {
          setdataR(response.body)
        }
      }
    }
    if (isMounted) {
      changeData()

    } else {
      setIsMounted(true);

    }

  }, [valveChanger])
  useEffect(() => {
    // getting the first data using 
    const data = async () => {
      try {
        const readingUrl = `${mainUrl}/flow/data`
        const response = await (await fetch(readingUrl)).json()

        if (response.success) {
          if (response.body) {
            setdataR(response.body)
          }
        }

      } catch (error) {
        console.log(error.message);
      }
    }
    data()

  }, []);

  const changeValues = () => {
    console.log("called");
    setChangeValve(!valveChanger)
  }

  useEffect(() => {
    const socket = io(mainUrl)
    socket.on("connect", () => console.log(socket.id))
    socket.on("dataSet", (data) => setdataR(data))
  }, [])

  const debugGauge = () => <GaugeComponent
    arc={{
      padding: 0.01,
      // nbSubArcs: 100,
      // colorArray: ['#EA4228', '#EFFF']
      subArcs: [
        { limit: 15, color: '#EA4228', showMark: true },
        { limit: 17, color: '#F5CD19', showMark: true },
        { limit: 28, color: '#5BE12C', showMark: true },
        { limit: 30, color: '#F5CD19', showMark: true },
        { color: '#EA4228' }
      ]
    }}
    labels={{
      valueLabel: { formatTextValue: value => value + 'ºC' },
      markLabel: {
        valueConfig: { formatTextValue: value => value + 'ºC' },
        marks: [
          { value: 22.5 }
        ]
      }
    }}
    value={100}
    minValue={10}
    maxValue={100}
  />
  return (
    CONSTANTS.debugSingleGauge ?
      <Container>
        <Row>
          <Col lg={{ offset: 2, span: 8 }}>
            <h6 className="mb-1">Single GaugeComponent for debugging</h6>
            {debugGauge()}
          </Col>
          <Col md={4}>
            <h6 className="mb-1">Single GaugeComponent for debugging</h6>
            {debugGauge()}
          </Col>
          <Col md={6}>
            <h6 className="mb-1">Single GaugeComponent for debugging</h6>
            {debugGauge()}
          </Col>
        </Row>
      </Container>
      :
      <>
        <Container fluid>
          <Row>
            <Col xs={12} lg={{ offset: 2, span: 8 }}>
              <h1>MUST</h1>
            </Col>
          </Row>

          <Row className="justify-content-center">
            <Col xs={12} lg={4} >
              <h4 className="mb-1">Real time Tracking (L/min)</h4>
              <GaugeComponent
                id="gauge-component-radial4"
                value={dataR.flowValue}
                maxValue={32}
                minValue={4}
                style={{ fontSize: "3rem", fontWeight: "bold" }}
                type="radial"
                labels={{
                  markLabel: {
                    type: "outer",
                    marks: [
                      { value: 5 },
                      { value: 10 },
                      { value: 15 },
                      { value: 20 },
                      { value: 25 },
                      { value: 30 },
                      { value: 35 },
                    ]
                  },
                }}
                arc={{
                  colorArray: ['#87CEEB', '#00FF00', "#FF0000"],
                  subArcs: [{ limit: 10 }, { limit: 25 }, {}],
                  padding: 0.02,
                  width: 0.24
                }}
                pointer={{
                  elastic: true,
                  animationDelay: 0,
                  color: "#FFA500"
                }}
              />
            </Col>
          </Row>
          <Row className='justify-content-center'>
            <Col xs={5} lg={4}>
              <But name={dataR.valve ? 'Open' : 'Close'} action={() => changeValues()} style={{ fontFamily: "sans-serif", fontSize: "1.2rem", outline: "none", backgroundColor: dataR.valve ? "#00FF00" : "#FF0000", border: "none", padding: "0.3rem 1.8rem", fontWeight: "bolder", textAlign: "center" }} ></But>
            </Col>
          </Row>
        </Container >
      </>
  )
};

export default App
