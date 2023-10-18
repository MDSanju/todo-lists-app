import { Box, Button, Title } from "@mantine/core";
import { useNavigate } from "react-router-dom";

const NotFound = () => {
  const navigate = useNavigate();

  const jumpToHome = () => {
    navigate("/");
  };

  return (
    <Box
      style={{
        display: "flex",
        flexDirection: "column",
        justifyContent: "center",
        alignItems: "center",
        height: "86vh",
      }}
    >
      <Title order={2}>404 Page Not Found!</Title>
      <Button onClick={jumpToHome} mt={16} variant="outline">
        Home
      </Button>
    </Box>
  );
};

export default NotFound;
