import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { makeStyles } from "@material-ui/core/styles";
import Card from "@material-ui/core/Card";
import CardContent from "@material-ui/core/CardContent";
import Button from "@material-ui/core/Button";
import Typography from "@material-ui/core/Typography";
import Container from "@material-ui/core/Container";
import HelpOutlineIcon from "@material-ui/icons/HelpOutline";
import TextField from "@material-ui/core/TextField";
import Grid from "@material-ui/core/Grid";
import { Link } from "react-router-dom";

import Loader from "./Loader";

import axios from "axios";
import axiosURL from "./config.json";

const useStyles = makeStyles({
  root: {
    minWidth: 275,
  },
  bullet: {
    display: "inline-block",
    margin: "0 2px",
    transform: "scale(0.8)",
  },
  title: {
    fontSize: 14,
  },
  pos: {
    marginBottom: 0,
  },
});

export default function SimpleCard({ profileId }) {
  const classes = useStyles();

  const URL = axiosURL.axiosURL;
  const [loading, setLoading] = useState(true);
  const [questionList, setQuestionList] = useState([]);
  const [answerList, setAnswerList] = useState([]);
  const [isDone, setIsDone] = useState(false);
  // console.log('resultObj')
  const { id } = useParams();
  const testId = id;

  useEffect(() => {
    async function fetchData() {
      const result = await axios.get(URL + "/questionList", {
        params: {
          testId: testId,
        },
      });
      setQuestionList(result.data);
      let answerListStart = [];
      result.data.map((item) => answerListStart.push([item.id, ""]));
      setAnswerList(answerListStart);
      // console.log(answerListStart)
      setLoading(false);
    }

    fetchData().then();
  }, [URL, testId, setLoading]);

  function handleInputValue(index, id, value) {
    // console.log(index, id, value)
    // console.log(answerList)
    let answerListState = answerList;
    answerListState[index][1] = value;
    setAnswerList(answerListState);
    console.log(answerListState);
  }

  function handleSubmit(event) {
    console.log(answerList);
    async function postData() {
      await axios
        .post(URL + "/passTest", {
          testId: testId,
          answerList: answerList,
          profileId: profileId.id,
        })
        .then(function (response) {
          
        })
        .catch(function (error) {
          console.log(error);
        });
    }
    postData();
    setIsDone(true);

    event.preventDefault();
  }

  if (loading) {
    return (
      <Container>
        <Loader />
      </Container>
    );
  }
  if (isDone) {
    return (
      <Container>
        <Grid
          container
          spacing={0}
          alignItems="center"
          alignContent="center"
          justify="center"
          style={{ marginTop: 105 }}
        >
          <Typography variant="h3" component="h1" align="center">
            Отлично, ответы отправлены!
          </Typography>
        </Grid>
        <Grid
          container
          spacing={0}
          alignItems="center"
          alignContent="center"
          justify="center"
          style={{ marginTop: 15 }}
        >
          <Link to="/" style={{ marginTop: 10, textDecoration: "none" }}>
            <Button variant="contained" color="secondary">
              Вернуться в личный кабинет
            </Button>
          </Link>
        </Grid>
      </Container>
    );
  }
  return (
    <div>
      <div style={{ marginTop: 20, textDecoration: "none" }}>
        <Typography variant="h4" component="h1" align="center">
          Заполните ответы и нажмите кнопку "Завершить тест"
        </Typography>
      </div>
      <Container>
        <form
          className={classes.root}
          noValidate
          autoComplete="off"
          onSubmit={handleSubmit}
        >
          {questionList.map((item, index) => (
            <Card className={classes.root} style={{ marginBottom: 15 }}>
              <CardContent>
                <Typography
                  className={classes.title}
                  color="textSecondary"
                  gutterBottom
                >
                  {index + 1}
                </Typography>

                <Typography variant="h5" component="h1">
                  <HelpOutlineIcon
                    style={{ marginRight: 5, marginBottom: -3 }}
                  />
                  {item.question}
                </Typography>
                <TextField
                  id="standard-basic"
                  label="Ответ"
                  variant="outlined"
                  style={{ marginTop: 15 }}
                  fullWidth={200}
                  onChange={(e) =>
                    handleInputValue(index, item.id, e.target.value)
                  }
                />
              </CardContent>
            </Card>
          ))}
          <Button
            type="submit"
            variant="contained"
            color="primary"
            style={{ marginTop: 15 }}
          >
            Заверишть тест
          </Button>
        </form>
      </Container>
    </div>
  );
}
