import { useContext, type ReactElement, useCallback, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import GroupView from "@/components/particles/group-view/group-view";
import { Button, Col, Row } from "antd";
import { useQuery } from "react-query";
import { getTile } from "@/api/tiles";
import Loading from "@/components/particles/loading";
import EntryView from "@/components/crystals/entry-view/entry-view";
import { tileViewContext } from "../student-dashboard/context";
import { ArrowLeftOutlined } from "@ant-design/icons";

function TileDetailView(): ReactElement {
  const { tid } = useParams();
  const context = useContext(tileViewContext);

  const { data: tile } = useQuery(
    `tile/${tid}/${context.user.userID}`,
    async () => await getTile(tid ?? -1),
  );

  const navigate = useNavigate();
  const back = (): void => {
    navigate("..");
  };
  const keyManager = useCallback((event: any) => {
    switch (event.key) {
      case "Escape":
        back();
        break;
      default:
        break;
    }
  }, []);

  useEffect(() => {
    window.addEventListener("keydown", keyManager);
    return () => {
      window.removeEventListener("keydown", keyManager);
    };
  });
  if (tile === undefined) {
    return <Loading />;
  }

  return (
    <>
      <Row>
        <Col>
          <Button
            type={"link"}
            style={{
              border: "1px solid",
              borderRadius: 20,
              width: 50,
              marginLeft: 20,
              padding: 0,
            }}
            icon={<ArrowLeftOutlined />}
            onClick={() => {
              back();
            }}
          />
        </Col>
      </Row>
      <Row style={{ minHeight: "60vh", padding: 5 }}>
        <Col span={24} style={{ padding: 5 }}>
          <GroupView title={tile.title}>
            {tile.entries.map((entry) => (
              <Col key={entry.content_id}>
                <EntryView entry={entry} type={tile.type} />
              </Col>
            ))}
          </GroupView>
        </Col>
      </Row>
    </>
  );
}

export default TileDetailView;
