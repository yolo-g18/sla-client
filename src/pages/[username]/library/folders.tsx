import LibraryLayout from "../../../components/layout/LibraryLayout";
import { useRouter } from "next/router";
import { useSelector } from "react-redux";
import { RootStore } from "../../../utils/TypeScript";
import { IFolder } from '../../../utils/TypeScript';
import React from 'react';
import DeleteOutlinedIcon from '@material-ui/icons/DeleteOutlined';
import Grid from '@material-ui/core/Grid';
import { deleteAPI } from '../../../utils/FetchData';
import { getAPI } from '../../../utils/FetchData';
import Link from "next/link";

interface Props {
  username?: string;
}
const defaultFolders: IFolder[] = [];
const folder = (props: Props) => {

  const [folders, setFolders]: [IFolder[], (folders: IFolder[]) => void] = React.useState(
    defaultFolders
  );

  const [loading, setLoading]: [
    boolean,
    (loading: boolean) => void
  ] = React.useState<boolean>(true);


  const [error, setError]: [string, (error: string) => void] = React.useState(
    'not found'
  );

  const { auth, alert, user } = useSelector((state: RootStore) => state);

  const router = useRouter();

  const {
    query: { username }, //id of folder get from path
  } = router;
  React.useEffect(() => {

    async function excute() {

      try {

        const res = await getAPI(`http://localhost:8080/getFolderListOfUser/${user._id}`);
        setFolders(res.data);
        setLoading(false);

      } catch (err) {
        setLoading(false);
        setError(err);

      }
    }

    excute();

  }, [username,user._id ,folders]);

  const [isShowRemoveModal, setIsShowRemoveModal] = React.useState(false);
  const [idRemoveFolder, setIdRemoveFolder]: [number, (idRemoveFolder: number) => void]
    = React.useState<number>(0);
  async function removeFolder() {


    // delete static data
    let index = folders.findIndex(obj => obj.folder_id === idRemoveFolder);

    const tempStudySets = folders.splice(index, 1);
    // delete dynamic data
    setLoading(true);
    try {

      const res = await deleteAPI('http://localhost:8080/deleteFolder/' + idRemoveFolder);
      setLoading(false);

    } catch (err) {
      setError(err);
      setLoading(false);

    }

    setIsShowRemoveModal(!isShowRemoveModal);

  }

  const handleRemoveFolder = (folder_id: number) => {
    setIsShowRemoveModal(!isShowRemoveModal);
    setIdRemoveFolder(folder_id);

  };
  const closeRemoveFolderModal = () => {
    setIsShowRemoveModal(!isShowRemoveModal);
  };


  return (
    <div>
      <LibraryLayout>

        {folders.map(item => (

          <div className="container flex flex-col mx-auto w-full bg-white dark:bg-gray-800 rounded-lg shadow" key={item.folder_id}>
            <ul className="flex flex-col divide divide-y">
              <li className="flex flex-row">
                <div className="select-none cursor-pointer flex flex-1 items-center p-4">
                  <div className="flex-1 pl-1 mr-16">
                    <Link
                      href={{
                        pathname: "/folder/[id]",
                        query: { id: item.folder_id }
                      }}
                    >
                      <div className="font-medium dark:text-white">
                        {item.title}
                      </div>
                    </Link>
                    <div className="text-gray-600 dark:text-gray-200 text-sm">
                      {item.numberOfSets <= 1 ?
                        item.numberOfSets + " set" : item.numberOfSets + " set"}
                    </div>
                  </div>
                  <div className="text-gray-600 dark:text-gray-200 text-xs">
                    {item.createdDate}
                  </div>
                  <button onClick={() => handleRemoveFolder(item.folder_id)} className="w-24 text-right flex justify-end">
                    <Grid item xs={8}>
                      <DeleteOutlinedIcon />

                    </Grid>
                  </button>
                </div>
              </li>
            </ul>
          </div>

        ))}
        {isShowRemoveModal ? (
          <div className="justify-center items-center flex overflow-x-hidden overflow-y-auto fixed inset-0 z-50 backdrop-filter backdrop-blur-xs -mt-12">
            <div className="h-screen w-full absolute flex items-center justify-center bg-modal">
              <div className="bg-white rounded shadow p-6 m-4 max-w-xs max-h-full text-center">
                <div className="mb-4"></div>
                <div className="mb-8">
                  <p>
                    Are you sure want to remove this folder?
                  </p>
                </div>

                <div className="flex justify-center">
                  <button
                    onClick={removeFolder}
                    className="text-white w-32 rounded mx-4 bg-yellow-500 hover:bg-yellow-600"
                  >
                    Remove
                  </button>
                  <button
                    onClick={closeRemoveFolderModal}
                    className=" text-white w-32 py-1 mx-4 rounded bg-green-500 hover:bg-green-600"
                  >
                    Cancel
                  </button>
                </div>
              </div>
            </div>
          </div>
        ) : null}
      </LibraryLayout>

    </div>
  )
};



export default folder;
