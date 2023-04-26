import { useEditMyAppointmentMutation } from "@api/appointments"
import { EditIcon } from "@chakra-ui/icons"
import { useToast, Popover, Flex, PopoverTrigger, IconButton, PopoverContent, PopoverCloseButton, PopoverHeader, PopoverBody, FormControl, FormLabel, Input, Button } from "@chakra-ui/react"
import { handleReloadtable } from "@store/reloadTable"
import { getCookie } from "cookies-next"
import moment from "moment"
import { useState, useEffect } from "react"
import { useDispatch } from "react-redux"
import { IRangeDates } from "src/pages/appointments"

export interface IModalAppointmentProps {
    appointmentId: number
}
  
export default function ModalEditAppointment({ appointmentId }: IModalAppointmentProps){
    const token = getCookie('auth_token')
    const toast = useToast()
    const dispatch = useDispatch()
  
    const [rangeDateTime, setRangeDateTime] = useState<IRangeDates>({
      startDate: '',
      endDate: ''
    })
    const [isDate, setIsDate] = useState<boolean>(false)
    const [editMyAppointments] = useEditMyAppointmentMutation()
  
    const handleEditMyAppointments = async () => {
      if(rangeDateTime.startDate && rangeDateTime.endDate){
        dispatch(handleReloadtable([false, true]))
        let formattedStartDate = moment(rangeDateTime.startDate).format('YYYY-MM-DD HH:mm:ss')
        let formattedEndDate = moment(rangeDateTime.endDate).format('YYYY-MM-DD HH:mm:ss')
  
        const payload = {
          token,
          appointmentId,
          appointments: {
            start_time: formattedStartDate,
            final_time: formattedEndDate
          }
        }
  
        await editMyAppointments(payload)
  
        toast({
          title: 'Apontamento atualizado!',
          status: 'success',
          duration: 3000,
          isClosable: true,
          position: 'top'
        })
        dispatch(handleReloadtable([false, true]))
      }
  
    }
    
    useEffect(() => {
      if(rangeDateTime.startDate && rangeDateTime.endDate){
        setIsDate(true)
      }
    }, [rangeDateTime.startDate, rangeDateTime.endDate, isDate])
  
    return (
      <Popover placement="right" closeOnBlur={true}>
        <Flex align={"center"} gap="5px" borderRadius={"8px"}>
            {/* trigger responsible modal */}
            <PopoverTrigger>
              <IconButton
                aria-label="Editar nome"
                bgColor={"transparent"}
                icon={<EditIcon w="15px" />}
              />
            </PopoverTrigger>
  
            <PopoverContent w='fit-content' cursor='default' position='relative' zIndex={'30'} ml='10px' boxShadow={'0px 0px 10px black'} bgColor='#2e2b2b' color="white" border='0'>
            <PopoverCloseButton />
  
            <PopoverHeader pt={4} fontWeight="bold" border="0">
                Editar tempo trackeado
            </PopoverHeader>
  
            <PopoverBody>
                <Flex direction={'column'} gap='12px' justify={'start'}>
                  <FormControl>
                    <FormLabel htmlFor="start-date">Data inicial:</FormLabel>
                    <Input onChange={(event) => setRangeDateTime({...rangeDateTime, startDate: event.target.value})} id='start-date' type={'datetime-local'} />
  
                    <FormLabel htmlFor='end-date' mt='20px'>Data final:</FormLabel>
                    <Input onChange={(event) => setRangeDateTime({...rangeDateTime, endDate: event.target.value})} id='end-date' type={'datetime-local'} />
                  </FormControl>
  
                  <Button isDisabled={!isDate} onClick={handleEditMyAppointments} bgColor={"#CC943C"} h='30px' fontSize='14px'>
                      Salvar
                  </Button>
                </Flex>
            </PopoverBody>
            </PopoverContent>
        </Flex>
      </Popover>
    )
  }