import { Skeleton, Table, TableContainer, Tbody, Td, Th, Thead, Tr } from "@chakra-ui/react";

export default function TableReloadingEffect(){
    return (
        <TableContainer
          boxShadow={"0 0 10px 0px #161616"}
          borderRadius="6px"
          overflowY={"auto"}
          maxH="900px"
          position={"relative"}
        >
          <Table variant="simple" overflow={"auto"}>
            <Thead position={"sticky"} top="0" height="50px">
              <Tr>
                <Th>
                  <Skeleton h="20px" w="100%" />
                </Th>
              </Tr>
            </Thead>

            <Tbody overflow={"auto"} h="900px" maxH={"900px"}>
              {[...Array(20)].map((_, index) => {
                return (
                  <Tr key={index}>
                    <Td>
                      <Skeleton h="20px" w="100%" />
                    </Td>
                  </Tr>
                );
              })}
            </Tbody>
          </Table>
        </TableContainer>
    )
}