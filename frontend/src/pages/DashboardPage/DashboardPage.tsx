import "./DashboardPage.css";
import { useEffect, useState } from "react";
import Slider, { DEFAULT_SLIDER_VAL } from "./components/Slider";
import GenderDropdownFilter from "./components/GenderDropdownFilter";
import RaceDropdownFilter from "./components/RaceDropdownFilter";
import PredictButton from "./components/PredictButton";
import Graph from "./components/Graph";
import { getGraphDataAPICall, getPastDataAPICall } from "../../services/ApiCalls";
import {
  FormattedBigGraphData,
  FormattedDataEntry,
  OneModeGraphData,
} from "../../types";
import ExportGraphButton from "./components/ExportGraphButton";
import { Box } from "@mui/material";
import RadioButtons from "./components/RadioButtons";
import InfoTooltip from "./components/InfoTooltip";
import BigNumber from "./components/BigNumber";
import HelpModal from "./components/HelpModal"
import * as React from "react";
import Navbar from "../components/NavBar";
import { formatNumberForDisplay } from "../utils/numberUtils";

export const CYAN = "#00bbbb";
export const PINK = "#ff4aa4";

function DashboardPage() {

  // Component State Variables
  const [sliderValue, setSliderValue] = useState<number>(DEFAULT_SLIDER_VAL);
  const [mode, setMode] = useState<string>("1");
  const [filterGender, setFilterGender] = useState<string>("NoFilter");
  const [filterRace, setFilterRace] = useState<string>("NoFilter");
  const [open, setOpen] = React.useState(false);

  // Data State Variables
  const [graphData, setGraphData] = useState<FormattedBigGraphData>();
  const [modeGraphData, setModeGraphData] = useState<OneModeGraphData>();
  const [pastData, setPastData] = useState<FormattedDataEntry[]>();


  async function getPastData() {
    const formattedData = await getPastDataAPICall(
      {
        filtering_factor: [filterGender, filterRace],
        num_points: sliderValue,
      },
      mode
    );

    if (formattedData) {
      setPastData(formattedData);
    }
  }

  async function getGraphData() {
    const formattedData = await getGraphDataAPICall({
      filtering_factor: [filterGender, filterRace],
      num_points: sliderValue,
    });

    if (formattedData) {
      setGraphData(formattedData);
    }
  }

  function updatePrediction() {
    getGraphData();
  }

  useEffect(() => {
    if (mode == "0") {
      setModeGraphData(graphData?.frequency_graph);
    } else {
      setModeGraphData(graphData?.revenue_graph);
    }
  }, [mode, graphData]);

  useEffect(() => {
    getPastData();
  }, []);

  useEffect(() => {
    if (graphData == undefined) {
      getPastData();
    }
  }, [mode]);

  useEffect(() => {
    setOpen(true);
  }, []);

  return (
    <div id="grid-container">
      <header>
      <Navbar/>
      </header>
      <header>
      <span style={{ display: "flex", justifyContent: "space-between", alignItems: "center", paddingTop: '80px', width: '100%' }}>
        <div style={{ marginRight: '20px' }}>
          <RadioButtons mode={mode} setMode={setMode} />
        </div>
        <HelpModal open={open} setOpen={setOpen} />
      </span>
    </header>

      <Box
        display="flex"
        justifyContent="center"
        alignItems="center"
      >
        {modeGraphData == undefined ? (
          pastData == undefined ? (
            <p>Loading</p>
          ) : (
            <Graph
              mode={mode}
              pastData={{
                name: "Known Data",
                color: CYAN,
                data: pastData,
              }}
            />
          )
        ) : (
          <Graph
            mode={mode}
            pastData={{
              name: "Known Data",
              color: CYAN,
              data: modeGraphData.past_biased_line,
            }}
            pastDataUnbiased={{
              name: "Known Data (Unbiased)",
              color: PINK,
              data: modeGraphData.past_unbiased_line,
            }}
            predictedData={{
              name: "Predicted Data",
              color: CYAN,
              data: modeGraphData.predicted_biased_line,
            }}
            predictedDataUnbiased={{
              name: "Predicted Data (Unbiased)",
              color: PINK,
              data: modeGraphData.predicted_unbiased_line,
            }}
          />
        )}
      </Box>

      <Box padding="40px">
        {modeGraphData == undefined ? (
          <p tabIndex={0}>no big numbers yet :(</p>
        ) : (
          <div>
            <BigNumber
              value={formatNumberForDisplay(modeGraphData.average_difference)}
              revenueOrTransactions={mode}
              averageOrTotal="average"
            />
            <BigNumber
              value={formatNumberForDisplay(modeGraphData.total_difference)}
              revenueOrTransactions={mode}
              averageOrTotal="total"
            />
          </div>
        )}

        <br />

        <span style={{ display: "flex", justifyContent: "space-between" }}>
          <h2 tabIndex={0}>Prediction Size:</h2>
          <InfoTooltip
            title="The slider is used to adjust the prediction size. Longer timeframe when slider is on the right."
            ariaLabel="Help with prediction size slider"
          ></InfoTooltip>
        </span>

        <Slider
          sliderValue={sliderValue}
          setSliderValue={setSliderValue}
          aria-labelledby="prediction-size-label"
        />

        <span style={{ display: "flex", justifyContent: "space-between" }}>
          <h2 tabIndex={0}>Filters:</h2>
          <InfoTooltip
            title="Select the filters below to investigate a subset of the dataset."
            ariaLabel="Help with filters"
          ></InfoTooltip>
        </span>
        <GenderDropdownFilter
          // filterFactor={filterFactor}
          // setFilterFactor={setFilterFactor}
          aria-label="Gender filter options"
          onSelectChange={(value: string) => setFilterGender(value)}
        />
        <RaceDropdownFilter
          aria-label="Race filter options"
          onSelectChange={(value: string) => setFilterRace(value)}
        />

        <span
          style={{
            display: "flex",
            justifyContent: "space-between",
            marginTop: "40px",
          }}
        >
          <PredictButton
            onClick={updatePrediction}
            aria-label="Update prediction"
          />
          <ExportGraphButton aria-label="Export graph" />
        </span>
      </Box>
    </div>
  );
}
export default DashboardPage;
