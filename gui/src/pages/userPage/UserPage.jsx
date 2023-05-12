import React, { useContext, useState } from "react";
import { UserProfileContext } from "../../contexts/userProfileContext";
import { WitnessContext } from "../../contexts/witnessContext";
import { Container, Col, Row } from "react-bootstrap";
import { Button, ButtonGroup, Box } from "@mui/material";
import ArrowForwardIosIcon from "@mui/icons-material/ArrowForwardIos";
import ArrowBackIosNewIcon from "@mui/icons-material/ArrowBackIosNew";
import styles from "./userPage.module.css";
import UserProfileCard from "../../components/user/userCard/UserProfileCard";
import UserInfoTable from "../../components/user/userTable/UserInfoTable";
import MultiSelectFilters from "../../components/operations/filters/MultiSelectFilters";
import OpCard from "../../components/operations/operationCard/OpCard";
import Loader from "../../components/loader/Loader";
import {
  handleNextPage,
  handlePrevPage,
  clearFilters,
} from "../../functions/user_page_func";
import JsonMetaData from "../../components/user/JsonMetaData";
import PostingJsonMetaData from "../../components/user/PostingJsonMetaData";
import Authorities from "../../components/user/Authorities";
import WitnessProps from "../../components/user/WitnessProps";
import WitnessVotes from "../../components/user/WitnessVotes";
import { useEffect } from "react";
import usePrevious from "../../components/customHooks/usePrevious";
import LinearLoader from "../../components/loader/LinearLoader";
import Sticky from "react-stickynode";
import TopScrollButton from "../../components/common/TopScrollButton";

export default function User_Page({ user }) {
  document.title = `HAF | User ${user}`;
  const {
    user_profile_data,
    acc_history_limit,
    op_filters,
    set_pagination,
    user_info,
    startDateState,
    endDateState,
    set_op_filters,
    setStartDateState,
    setEndDateState,
    pagination,
    debouncePagination,
    userDataLoading,
  } = useContext(UserProfileContext);
  const { witnessData } = useContext(WitnessContext);
  const [show_filters, set_show_filters] = useState(false);
  const [prevNextPage, setPrevNextPage] = useState([]);
  const [get_last_trx_on_page, set_get_last_trx_on_page] = useState(0);
  const [get_first_trx_on_page, set_get_first_trx_on_page] = useState(0);
  const [pageCount, setPageCount] = useState(1);
  const [isTopButtonShowing, setIsTopButtonShowing] = useState(false);

  const user_witness = witnessData?.filter((w) => w.witness === user);
  const max_trx_nr = user_profile_data?.[0]?.acc_operation_id;
  const last_trx_on_page =
    user_profile_data?.[acc_history_limit - 1]?.acc_operation_id;

  const isOperationsLoading =
    pagination !== debouncePagination || userDataLoading;

  const prevUser = usePrevious(user);

  useEffect(() => {
    if (prevUser === user) {
      set_get_last_trx_on_page(last_trx_on_page);
      set_get_first_trx_on_page(max_trx_nr);
    } else {
      setEndDateState(null);
      setStartDateState(null);
      set_pagination(-1);
      set_op_filters([]);
      setPageCount(1);
    }
  }, [prevUser, max_trx_nr, user, last_trx_on_page]);

  useEffect(() => {
    if (show_filters && op_filters.length) {
      setPageCount(1);
    }
  }, [show_filters, op_filters]);

  onscroll = () => {
    const lastWindowPosition = window.scrollY;
    if (lastWindowPosition === 0) {
      setIsTopButtonShowing(false);
    } else {
      setIsTopButtonShowing(true);
    }
  };

  return (
    <>
      {!user_profile_data || !user_info ? (
        <Loader />
      ) : (
        <Container className={styles.user_page} fluid>
          <Row className="d-flex">
            <Col sm={12} md={5} lg={5} xl={3}>
              <UserProfileCard user={user} />
              <UserInfoTable user_info={user_info} />
              <JsonMetaData user_info={user_info} />
              <PostingJsonMetaData user_info={user_info} />
              {user_witness && (
                <>
                  <Authorities
                    user_info={user_info}
                    user_witness={user_witness}
                  />
                  <WitnessProps
                    user_info={user_info}
                    user_witness={user_witness}
                  />
                </>
              )}

              <WitnessVotes user_info={user_info} />
            </Col>

            <Col sm={12} md={7} lg={7} xl={9}>
              <MultiSelectFilters
                show_filters={show_filters}
                set_show_filters={set_show_filters}
              />

              <Sticky innerZ={2} enabled={true}>
                <Row className={styles.stickyRow}>
                  <Col className="d-flex justify-content-between align-items-center">
                    <Box>
                      <p className={styles.operationsCount}>
                        Operations : {user_profile_data?.length}
                      </p>
                      <p className={styles.operationsCount}>
                        Page Count : {pageCount}
                      </p>
                    </Box>
                    <ButtonGroup
                      sx={{
                        height: "40px",
                      }}
                      size="small"
                      disableElevation
                      variant="contained"
                      color="secondary"
                    >
                      <Button
                        onClick={() =>
                          handlePrevPage(
                            set_pagination,
                            prevNextPage,
                            setPrevNextPage,
                            setPageCount,
                            pageCount
                          )
                        }
                        disabled={pageCount === 1 || isOperationsLoading}
                      >
                        <ArrowBackIosNewIcon />
                      </Button>

                      <Button
                        onClick={() =>
                          handleNextPage(
                            set_pagination,
                            get_last_trx_on_page,
                            get_first_trx_on_page,
                            setPrevNextPage,
                            setPageCount,
                            pageCount
                          )
                        }
                        disabled={
                          acc_history_limit > user_profile_data.length ||
                          isOperationsLoading
                        }
                      >
                        <ArrowForwardIosIcon />
                      </Button>
                    </ButtonGroup>

                    {op_filters.length === 0 &&
                    startDateState === null &&
                    endDateState === null ? (
                      <>
                        <Button
                          variant="contained"
                          color="secondary"
                          onClick={() => set_show_filters(!show_filters)}
                        >
                          Filters
                        </Button>
                      </>
                    ) : (
                      <ButtonGroup>
                        <Button
                          variant="contained"
                          color="warning"
                          onClick={() => set_show_filters(!show_filters)}
                        >
                          Filters (active)
                        </Button>
                        <Button
                          onClick={() =>
                            clearFilters(
                              setEndDateState,
                              setStartDateState,
                              set_op_filters,
                              set_pagination,
                              setPageCount
                            )
                          }
                          variant="contained"
                          color="secondary"
                        >
                          Clear filters
                        </Button>
                        <MultiSelectFilters
                          show_filters={show_filters}
                          set_show_filters={set_show_filters}
                        />
                      </ButtonGroup>
                    )}
                  </Col>
                </Row>
                <LinearLoader isLoading={isOperationsLoading} />
              </Sticky>
              {user_profile_data.length === 0 ? (
                "No operations found"
              ) : (
                <>
                  {user_profile_data.map((profile) => (
                    <Row key={profile.operation_id}>
                      <Col>
                        <OpCard block={profile} full_trx={profile} />
                      </Col>
                    </Row>
                  ))}
                </>
              )}
            </Col>
          </Row>
          {isTopButtonShowing && <TopScrollButton />}
        </Container>
      )}
    </>
  );
}
