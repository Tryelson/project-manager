import { Button, Badge } from "@chakra-ui/react";
import { IStatusType } from "../domain/task";

interface IStatusBtnProps {
    status: IStatusType
}

export default function StatusBtn({status}: IStatusBtnProps){
    return (
        <>
          {
            status && (
              <Button bgColor={status.background} _hover={{opacity: '0.8'}} w='fit-content' p='0' minW='130px'>
                <Badge color={status.color} fontWeight={'bold'} p='0 10px' backgroundColor='unset' borderRadius={"5px"} cursor='pointer'>{status.name}</Badge>
              </Button>
            )
          }
        </>
    )
}