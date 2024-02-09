import {
  Divider,
  Heading,
  Box,
  FormControl,
  FormLabel,
  Input,
  FormHelperText,
  Select,
  Flex,
  Checkbox,
  CheckboxGroup,
  VStack,
  Button,
  Grid,
  GridItem,
} from "@chakra-ui/react";
import { useEffect, useState } from "react";
import { INTERESTS_LIST, SKILLS_LIST } from "../constants/admin";
import axios from "axios";
import Interest from "../formhelpers/Interest";
import ProfileInterest from "../formhelpers/ProfileInterest";
import ProfileInfo from "../formhelpers/ProfileInfo";
import ProfileSkill from "../formhelpers/ProfileSkill";
import {
  paleRed,
  palestRed,
  primaryRed,
  secondaryRed,
  tertiaryRed,
  white,
} from "../constants/color";

export const ProfileForm = () => {
  const [user, setUser] = useState({
    firstName: "",
    lastName: "",
    dateOfBirth: "",
    gender: "",
    phoneNumber: "",
    emergencyContact: "",
    occupation: "",
    school: "",
    immigrationStatus: "",
    canDrive: false,
    ownVehicle: false,
  });

  const config = {
    headers: {
      "Content-type": "application/json",
      Authorization: "Bearer " + localStorage.getItem("@user"),
    },
  };

  useEffect(() => {
    retrieveProfile();
  }, []);

  const [skillsArr, setSkills] = useState([]);
  const [interestArr, setInterest] = useState([]);
  const [editMode, setEditMode] = useState(false);

  const handleInputChange = (e) => {
    const { name, value, checked } = e.target;
    if (name == "canDrive" || name == "ownVehicle") {
      setUser({
        ...user,
        [name]: checked,
      });
    } else {
      setUser({
        ...user,
        [name]: value,
      });
    }
  };

  const handleCheckBox = (e) => {
    const { name, checked, value } = e.target;
    if (checked) {
      if (name === "skills") {
        setSkills([...skillsArr, value]);
      } else if (name === "interest") {
        setInterest([...interestArr, value]);
      }
    } else {
      if (name === "skills") {
        setSkills(skillsArr.filter((skill) => skill !== value));
      } else if (name === "interest") {
        setInterest(interestArr.filter((interest) => interest !== value));
      }
    }
  };

  const handleSubmit = async () => {
    let editedUser = {
      ...user,
      ["skills"]: skillsArr,
      ["interest"]: interestArr,
    };
    console.log("edited user: ", editedUser);
    let result = await axios.put("/api/userUpdate", editedUser, config);
    console.log("result: ", result);
  };

  const retrieveProfile = async () => {
    try {
      let result = await axios.get("/api/user", config);
      setUser({
        ...result.data,
      });

      setSkills([...result.data.skills]);

      setInterest([...result.data.interest]);
    } catch (e) {
      console.log(e);
    }
  };

  return (
    <Box borderRadius={8} backgroundColor={paleRed} width="100%" p={5}>
      <Grid templateColumns="repeat(10, 1fr)">
        <GridItem colSpan={5} mr={3}>
          <ProfileInfo
            handleInputChange={handleInputChange}
            editMode={editMode}
            user={user}
          />
        </GridItem>

        <GridItem colSpan={2}>
          <ProfileInterest
            INTERESTS_LIST={INTERESTS_LIST}
            handleCheckBox={handleCheckBox}
            editMode={editMode}
            interestArr={interestArr}
          />

          <ProfileSkill
            SKILLS_LIST={SKILLS_LIST}
            handleCheckBox={handleCheckBox}
            editMode={editMode}
            skillsArr={skillsArr}
          />
        </GridItem>
      </Grid>

      {!editMode ? (
        <Button
          onClick={() => setEditMode(true)}
          backgroundColor={primaryRed}
          borderColor={primaryRed}
          color={white}
          variant="filled"
          sx={{
            ":hover": {
              backgroundColor: secondaryRed,
              ":focus": { backgroundColor: tertiaryRed },
            },
          }}
          mr={2}
          height="36px"
          width="150px"
          p={5}
          mt={3}
        >
          Edit
        </Button>
      ) : (
        <>
          <Button
            backgroundColor={primaryRed}
            borderColor={primaryRed}
            color={white}
            variant="filled"
            sx={{
              ":hover": {
                backgroundColor: secondaryRed,
                ":focus": { backgroundColor: tertiaryRed },
              },
            }}
            mr={2}
            height="36px"
            width="150px"
            p={5}
            mt={3}
            onClick={() => handleSubmit()}
          >
            Save
          </Button>
          <Button
            height="36px"
            width="150px"
            mt={3}
            p={5}
            onClick={() => setEditMode(false)}
          >
            Cancel
          </Button>
        </>
      )}
    </Box>
  );
};

export default ProfileForm;
