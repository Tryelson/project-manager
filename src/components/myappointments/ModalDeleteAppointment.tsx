import { useDeleteAppointmentMutation } from "@api/appointments"
import { DeleteIcon } from "@chakra-ui/icons"
import { useToast, useDisclosure, IconButton, Modal, ModalOverlay, ModalContent, ModalHeader, ModalCloseButton, ModalBody, Flex, Button } from "@chakra-ui/react"
import { handleReloadtable } from "@store/reloadTable"
import { getCookie } from "cookies-next"
import { useEffect } from "react"
import { useDispatch } from "react-redux"  
import { IModalAppointmentProps } from "./ModalEditAppointment"

export default function ModalDeleteAppointment ({ appointmentId }: IModalAppointmentProps) {
    const token = getCookie('auth_token')
    const toast = useToast()
    const dispatch = useDispatch()
    const { isOpen, onOpen, onClose } = useDisclosure()
  
    const [deleteAppointment, { isLoading, isError, isSuccess }] = useDeleteAppointmentMutation()
  
    const onDeleteAppointment = async () => {
        const payload = {
          token,
          appointmentId
        }
        await deleteAppointment(payload)
      }
      useEffect(() => {
        if(isSuccess){
          toast({
            title: 'Apontamento excluído!',
            status: 'success',
            duration: 3000,
            isClosable: true,
            position: 'top'
          })
          dispatch(handleReloadtable([false, true]))
        } else {
          dispatch(handleReloadtable([false, false]))
        }
  
        if(isError){
          toast({
            title: 'Erro ao excluir apontamento',
            status: 'error',
            duration: 3000,
            isClosable: true,
            position: 'top'
          })
        }
        
      }, [isSuccess, isError])
  
    return (
      <>
        <IconButton
          aria-label="Editar nome"
          bgColor={"transparent"}
          icon={<DeleteIcon w="15px" />}
          onClick={onOpen}
        />
      
        <Modal isOpen={isOpen} onClose={onClose} isCentered>
            <ModalOverlay />
            <ModalContent bg={'#1E1E1E'} pb={'20px'}>
              <ModalHeader>Excluir apontamento?</ModalHeader>
              <ModalCloseButton />
  
              <ModalBody mt='20px'>
                <Flex justify={'flex-end'}>
                  <Button mr={3} onClick={onClose}>Cancelar</Button>
                  <Button bg={'#C30C0C'} isLoading={isLoading} loadingText="Excluindo..." onClick={onDeleteAppointment}>Excluir</Button>
                </Flex>
              </ModalBody>
  
            </ModalContent>
          </Modal>
      </>
    )
  }