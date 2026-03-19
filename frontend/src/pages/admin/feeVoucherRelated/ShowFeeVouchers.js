import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { fetchFeeVouchers } from "../../../redux/feeVoucherRelated/feeVoucherHandle";
import { Paper, Box, IconButton } from "@mui/material";
import DeleteIcon from "@mui/icons-material/Delete";
import TableTemplate from "../../../components/TableTemplate";
import { BlueButton, GreenButton } from "../../../components/buttonStyles";
import SpeedDialTemplate from "../../../components/SpeedDialTemplate";
import Popup from "../../../components/Popup";

const ShowFeeVouchers = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { feeVouchers, loading, error } = useSelector(
    (state) => state.feeVoucher,
  );

  useEffect(() => {
    dispatch(fetchFeeVouchers());
  }, [dispatch]);

  const [showPopup, setShowPopup] = useState(false);
  const [message, setMessage] = useState("");

  const deleteHandler = (deleteID) => {
    setMessage("Sorry the delete function has been disabled for now.");
    setShowPopup(true);
  };

  const feeVoucherColumns = [
    { id: "student", label: "Student", minWidth: 170 },
    { id: "amount", label: "Amount", minWidth: 100 },
    { id: "status", label: "Status", minWidth: 100 },
  ];

  const feeVoucherRows =
    feeVouchers && feeVouchers.length > 0
      ? feeVouchers.map((voucher) => ({
          student: voucher.student?.name || "N/A",
          amount: voucher.amount,
          status: voucher.status,
          id: voucher._id,
        }))
      : [];

  const FeeVoucherButtonHaver = ({ row }) => (
    <>
      <IconButton onClick={() => deleteHandler(row.id)}>
        <DeleteIcon color="error" />
      </IconButton>
      <BlueButton
        variant="contained"
        onClick={() => navigate(`/Admin/feevouchers/voucher/${row.id}`)}
      >
        View
      </BlueButton>
    </>
  );

  const actions = [
    {
      icon: <GreenButton variant="contained">Add Fee Voucher</GreenButton>,
      name: "Add New Fee Voucher",
      action: () => navigate("/Admin/feevouchers/add"),
    },
    {
      icon: <DeleteIcon color="error" />,
      name: "Delete All Fee Vouchers",
      action: () => setShowPopup(true),
    },
  ];

  return (
    <>
      {loading ? (
        <div>Loading...</div>
      ) : (
        <>
          <Paper sx={{ width: "100%", overflow: "hidden" }}>
            {Array.isArray(feeVoucherRows) && feeVoucherRows.length > 0 && (
              <TableTemplate
                buttonHaver={FeeVoucherButtonHaver}
                columns={feeVoucherColumns}
                rows={feeVoucherRows}
              />
            )}
            <SpeedDialTemplate actions={actions} />
          </Paper>
        </>
      )}
      <Popup
        message={message}
        setShowPopup={setShowPopup}
        showPopup={showPopup}
      />
    </>
  );
};

export default ShowFeeVouchers;
