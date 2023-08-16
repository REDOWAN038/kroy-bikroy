// import { ViewIcon } from "@chakra-ui/icons";
// import {
//   Modal,
//   ModalOverlay,
//   ModalContent,
//   ModalHeader,
//   ModalFooter,
//   ModalBody,
//   ModalCloseButton,
//   Button,
//   useDisclosure,
//   IconButton,
//   Text,
//   Image,
// } from "@chakra-ui/react";

// const ProfileModal = ({ user, children }) => {
//   const { isOpen, onOpen, onClose } = useDisclosure();

//   return (
//     <>
//       {children ? (
//         <span onClick={onOpen}>{children}</span>
//       ) : (
//         <IconButton d={{ base: "flex" }} icon={<ViewIcon/>} onClick={onOpen} />
//       )}
//       <Modal isOpen={isOpen} onclose={onClose}>
//         <ModalOverlay/>
//           <ModalContent>
//             <ModalHeader
//             fontSize="40px"
//             fontFamily="Work sans"
//             d="flex"
//             justifyContent="center" 
//             >

//             {user.name}
//             </ModalHeader>
//             <ModalCloseButton/>
//           </ModalContent>
//          <ModalBody>
//           <Image borderRadius = "full"
//           boxSize="150px"
//           src={user.pic}
//           alt={user.name}
//           />
//          </ModalBody>
//          <ModalFooter> 
//           <Button colorScheme="blue" mr={3} onClick={{onClose}}>
//             Close

//           </Button>
          
//          </ModalFooter>
//       </Modal>
     
//     </>
//   );
// };

// export default ProfileModal;
import { useDisclosure }  from "@chakra-ui/hooks"
import React from 'react';
const Pe