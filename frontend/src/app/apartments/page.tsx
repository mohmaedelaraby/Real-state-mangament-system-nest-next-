import { Col, Empty, Row } from "antd";
import PageHeader from "@/features/apartments/components/PageHeader";
import ApartmentCard from "@/features/apartments/components/ApartmentCard";
import ApartmentPagination from "@/features/apartments/components/ApartmentPagination";
import SearchBar from "@/features/apartments/components/SearchBar";
import FilterSidebar from "@/features/apartments/components/FilterSidebar";
import { fetchApartments } from "@/features/apartments/api/apartmentsApi";
import styles from "@/features/apartments/styles/homePage.module.css";

const PAGE_SIZE = 9;

interface Props {
  searchParams: Promise<{
    search?: string;
    project?: string;
    city?: string;
    page?: string;
  }>;
}

/**
 * Server Component (SSR): fetches the apartment list on the server for every
 * request/navigation, using the URL's query string as the sole source of
 * truth for search/filter/pagination state (see SearchBar, FilterSidebar,
 * ApartmentPagination, which write to the URL instead of holding local
 * React state). See the README's "Why SSR for the listing and detail pages"
 * section for the full rationale and tradeoffs.
 */
export default async function ApartmentsPage({ searchParams }: Props) {
  const params = await searchParams;
  const search = params.search ?? "";
  const project = params.project ?? "";
  const city = params.city ?? "";
  const page = Number(params.page ?? "1") || 1;

  const { data: apartments, total } = await fetchApartments({
    search,
    project,
    city,
    page,
    limit: PAGE_SIZE,
  });

  return (
    <div>
      <PageHeader />
      <div className={styles.container}>
        <div className={styles.heroBlock}>
          <div className={styles.heroTitle}>Find your next place</div>
          <div className={styles.heroSubtitle}>
            {total} curated unit{total === 1 ? "" : "s"} across Egypt&apos;s top
            compounds
          </div>
        </div>

        <div className={styles.searchWrap}>
          <SearchBar />
        </div>

        <Row gutter={[32, 24]}>
          <Col xs={24} md={7} lg={6}>
            <FilterSidebar />
          </Col>

          <Col xs={24} md={17} lg={18}>
            <div className={styles.resultsCount}>
              {total} result{total === 1 ? "" : "s"}
              {search ? ` for "${search}"` : ""}
            </div>

            {apartments.length === 0 ? (
              <Empty
                description="No apartments found"
                className={styles.emptyState}
              />
            ) : (
              <>
                <Row gutter={[20, 20]}>
                  {apartments.map((apartment) => (
                    <Col key={apartment.id} xs={24} sm={12} lg={8}>
                      <ApartmentCard apartment={apartment} />
                    </Col>
                  ))}
                </Row>
                <div className={styles.paginationWrap}>
                  <ApartmentPagination
                    current={page}
                    pageSize={PAGE_SIZE}
                    total={total}
                  />
                </div>
              </>
            )}
          </Col>
        </Row>
      </div>
    </div>
  );
}
